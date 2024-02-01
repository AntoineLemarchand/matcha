import React, { useEffect, useState } from "react";
import sendHttp from "../utils/sendHttp";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  createColumnHelper,
  getSortedRowModel,
} from "@tanstack/react-table";

const Profiles = () => {

  const navigate = useNavigate();

  const [sorting, setSorting] = useState([])

  const [propositions, setPropositions] = useState([]);

  const getImageURL = (imageBuffer) => {
    if (imageBuffer.startsWith('/')) {
      return `${process.env.REACT_APP_API_URL}${imageBuffer}`;
    } else {
      return imageBuffer.toString("base64");
    }
  }

  useEffect(() => {
    sendHttp("/user/propositions", "GET").then((data) => {
      setPropositions(data);
    })
      .catch((error) => {
        console.log(error);
        if (error === 400)
        navigate("/onboarding")
        // navigate("/");
        console.error(error);
      });
  }, [navigate]);

  const getAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    if (isNaN(birthDate)) {
      return 'Invalid Date';
    }

    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  const tableInstance = useReactTable({
    columns: [
      createColumnHelper().accessor('image_0', {
        header: 'Image',
        cell: (Info) => <img src={getImageURL(Info.getValue())} alt="profile" />,
        footer: 'Image',
      }),
      createColumnHelper().accessor('first_name', {
        header: 'Name',
        cell: (Info) => <span>{Info.getValue()}</span>,
        footer: 'Name',
      }),
      createColumnHelper().accessor('date_of_birth', {
        header: 'Age',
        cell: (Info) => <span>{getAge(Info.getValue())}</span>,
        footer: 'Age',
      }),
      createColumnHelper().accessor('distance', {
        header: 'Distance',
        cell: (Info) => <span>TODO</span>,
        footer: 'Distance',
      }),
      createColumnHelper().accessor('fame', {
        header: 'Fame',
        cell: (Info) => <span>TODO</span>,
        footer: 'Fame',
      }),
      createColumnHelper().accessor('common_tags', {
        header: 'Tags in common',
        cell: (Info) => <span>TODO</span>,
        footer: 'Tags in common',
      }),
    ],
    data: propositions,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
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
                      {...{
                        className: header.column.getCanSort()
                          ? 'cursor-pointer select-none'
                          : '',
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {tableInstance
            .getRowModel()
            .rows.slice(0, 10)
            .map(row => {
              return (
                <tr key={row.id}>
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
        <tfoot>
          {tableInstance.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.footer,
                      header.getContext()
                    )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div className="h-4" />
    </div>
  )
};

export default Profiles;
