import React, { useEffect, useState } from "react";
import sendHttp from "../utils/sendHttp";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  createColumnHelper,
  getSortedRowModel,
} from "@tanstack/react-table";

const History = () => {

  const navigate = useNavigate();

  // eslint-disable-next-line no-unused-vars
  const [sendMessage, receivedMessage, user] = useOutletContext();

  const [views, setViews] = useState([]);
  const [sorting, setSorting] = useState([])

  useEffect(() => {
    sendHttp("/user/views", "GET").then((data) => {
      setViews(data);
    })
    .catch((error) => {
      if (error === 400)
      navigate("/onboarding")
    });
  }, [navigate]);

  const getTimeSince = (date) => {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
    if (years > 0) {
      return `${years} year${years === 1 ? '' : 's'} ago`;
    }
    if (months > 0) {
      return `${months} month${months === 1 ? '' : 's'} ago`;
    }
    if (days > 0) {
      return `${days} day${days === 1 ? '' : 's'} ago`;
    }
    if (hours > 0) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }
    if (minutes > 0) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    }
    if (seconds > 0) {
      return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
    }
    return 'just now';
  }

  const columns = [
    createColumnHelper().accessor('date_viewed', {
      header: 'Date',
      cell: (Info) => <span>{getTimeSince(new Date(Info.getValue()))}</span>,
    }),
    createColumnHelper().accessor(row => {
      if (!user) return;
      switch (row.action) {
        case 'seen':
          return row.user_id === user.id ? row.viewed_user_first_name + ' ' + row.viewed_user_last_name : row.user_first_name + ' ' + row.user_last_name;
        case 'like':
          return row.user_id === user.id ? 'You liked ' + row.viewed_user_first_name + ' ' + row.viewed_user_last_name : row.user_first_name + ' ' + row.user_last_name + ' liked you';
        default:
          return 'Unknown';
      }
    }, {
      header: 'Action',
      enableSorting: false,
      cell: (Info) => <span>{Info.getValue()}</span>,
    }),
  ]

  const tableInstance = useReactTable({
    columns,
    data: views,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),

    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="history">
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
                      {header.column.getCanSort() && ({
                        asc: ' ↑',
                        desc: ' ↓',
                      }[header.column.getIsSorted()] ?? ' ~')}
                    </div>
                  )}
                  </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {tableInstance.getRowModel().rows.map(row => {
            return (
              <tr key={row.id}
                onClick={() => {navigate('../profile/'
                  + (row.original.user_id === user.id ? row.original.viewed_user_id : row.original.user_id))}}
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

export default History;
