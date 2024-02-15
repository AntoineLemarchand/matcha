import React, { useEffect, useState } from "react";
import sendHttp from "../utils/sendHttp";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  createColumnHelper,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  rankItem,
} from "@tanstack/match-sorter-utils";
import ImagePreview from "../components/ImagePreview";

function DebouncedInput({ value: initialValue, onChange, debounce = 500, ...props }) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, debounce, onChange])

  return (
    <input {...props} value={value} onChange={e => setValue(e.target.value)} />
  )
}

function Filter({ column, table }) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = React.useMemo(
    () =>
      typeof firstValue === 'number'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column, firstValue]
  )

  return typeof firstValue === 'number' ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue)?.[0] ?? ''}
          onChange={value =>
            column.setFilterValue((old) => [value, old?.[1]])
          }
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0]
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ''
          }`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue)?.[1] ?? ''}
          onChange={value =>
            column.setFilterValue((old) => [old?.[0], value])
          }
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ''
          }`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : (
    <>
      <datalist id={column.id + 'list'}>
        {sortedUniqueValues.slice(0, 5000).map((value) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '')}
        onChange={value => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="w-36 border shadow rounded"
        list={column.id + 'list'}
      />
      <div className="h-1" />
    </>
  )
}

const Profiles = () => {

  const navigate = useNavigate();

  const [ sendMessage, receivedMessage, user ] = useOutletContext();

  const [propositions, setPropositions] = useState([]);

  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])

  useEffect(() => {
    if (!user) return;
    if (!user.validated) return navigate("/onboarding");
    sendHttp("/user/propositions", "GET").then((data) => {
      setPropositions(data);
    })
      .catch((error) => {
        navigate("/")
      });
  }, [navigate, user]);

  const getAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    if (isNaN(birthDate)) {
      return 'Invalid Date';
    }

    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  const columns = [
    createColumnHelper().accessor('image_0', {
      header: 'Image',
      enableColumnFilter: false,
      cell: (Info) => <ImagePreview image={Info.getValue()} />,
    }),
    createColumnHelper().accessor(row => `${row.first_name} ${row.last_name}`, {
      header: 'Name',
      cell: (Info) => <span>{Info.getValue()}</span>,
    }),
    createColumnHelper().accessor(row => getAge(row.date_of_birth), {
      id: 'age',
      header: 'Age',
      cell: (Info) => <span>{Info.getValue()}</span>,
    }),
    createColumnHelper().accessor(row => Math.floor(row.distance ?? 0), {
      header: 'Distance',
      cell: (Info) => <span>{Math.floor(Info.getValue())}kms</span>,
    }),
    createColumnHelper().accessor(row => Math.round(row.fame * 100) / 100, {
      header: 'Fame',
      cell: (Info) => <span>{Info.getValue()}</span>,
    }),
    createColumnHelper().accessor(row => row.count, {
      header: 'Tags in common',
      cell: (Info) => <span>{Info.getValue()}</span>,
    }),
  ]

  const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)

    addMeta({
      itemRank,
    })

    return itemRank.passed
  }

  const tableInstance = useReactTable({
    columns,
    data: propositions,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),

    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),

    onColumnFiltersChange: setColumnFilters,
  });

  return (
    <div className="p-2">
      <table>
        <thead>
          {tableInstance.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div
                      style={header.column.getCanSort() ? { cursor: 'pointer', userSelect: 'none' } : {}}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: ' ↑',
                        desc: ' ↓',
                      }[header.column.getIsSorted()] ?? ' ~'}
                    </div>
                  )}
                  {header.column.getCanFilter() ? (
                    <div>
                      <Filter column={header.column} table={tableInstance} />
                    </div>
                  ) : null}
                  </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {tableInstance.getRowModel().rows.map(row => {
            return (
              <tr key={row.id}
                onClick={() => navigate(`profile/${row.original.id}`)}
              >
                {row.getVisibleCells().map(cell => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="h-4" />
    </div>
  )
};

export default Profiles;
