import '../assets/styles/table.css'
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel } from '@tanstack/react-table'
import React, { useState } from 'react';
import Blockie from './ui/blockies';
import { Copy, Check, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'

const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 11)}\u2026${address.slice(-8)}`;
  };

const AdressCell = ({ value }) => {
    const [isCopied, setIsCopied] = React.useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value)
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 1500)
        } catch(err) {
            console.error('Copy failed: ', err);
        }
    };

    return (
        <div  className='flex gap-4 items-center group'>
            <Blockie address={value} className='px-10'/>
            <span onClick={() => window.open(`https://etherscan.io/address/${value}`, '_blank')}
                className='cursor-pointer hover:italic'>
                { shortenAddress(value) }
                </span>
            <button 
            onClick={handleCopy} 
            className={`cursor-pointer text-white opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-700`}>
                { isCopied ? <Check size={18}/> : <Copy size={18}/> }
            </button>
        </div>
    )
}


const Table = ({ data }) => {
    const columns = [
        {
            accessorKey: 'address',
            header: 'Address',
            size: 280,
            cell: ({ cell}) => (
                <AdressCell value={cell.getValue()}/>
            ),
        },
        {
            accessorKey: 'name',
            header: 'Name Tag',
            size: 280, 
            cell: (props) => <p>{props.getValue()}</p>
        },
        {
            accessorKey: 'eth',
            header: ({column}) => {
                return (
                    <span 
                    className="flex items-center justify-between cursor-pointer" 
                    onClick={() => column.toggleSorting()}>
                        ETH 
                        {column.getIsSorted() === 'asc' && <ArrowUp size={16} />}
                        {column.getIsSorted() === 'desc' && <ArrowDown size={16} />}
                        {!column.getIsSorted() && <ArrowUpDown size={16} className="text-gray-600" />}
                    </span>
                )
            },
            size: 200,
            enableSorting: true,
            cell: (props) => {
                const value = props.getValue()
                return (
                    <span>
                        {Number(value).toFixed(4)}
                    </span>
            )}
        },
        {
            accessorKey: 'usdBalance',
            header: 'USD',
            size: 200,
            cell: (props) => {
                const value = props.getValue()
                return (
                    <span className='w-max'>
                        {typeof value === 'number' ? value.toLocaleString('en-US', {style: 'currency', currency:'USD'}) : '-'}
                    </span>
                )
            }
            
        },
    ]

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 13,
    })
    const [sorting, setSorting] = useState([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            pagination,
            sorting
        },
    });
    
    return (
        <div>
            <table className='table'>
            <thead className='table-header-group w-full text-white'>
                {table.getHeaderGroups().map(headerGroup => 
                    <tr key={headerGroup.id} className='table-row'>
                        {headerGroup.headers.map(header => 
                            <td key={header.id} 
                            className='table-cell text-left py-2 px-2'
                            style={{ 
                                width: header.getSize() + 'px',
                                minWidth: header.getSize() + 'px',
                                maxWidth: header.getSize() + 'px'
                            }}>
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </td>
                        )}
                    </tr>)}
            </thead>
            <tbody className='table-row-group'>
                {table.getRowModel().rows.map(row => {
                    return(
                        <tr key={row.id} 
                        className='table-row'>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} 
                                className={`table-cell py-2 px-2`}
                                style={{ 
                                    width: cell.column.getSize() + 'px',
                                    minWidth: cell.column.getSize() + 'px',
                                    maxWidth: cell.column.getSize() + 'px'
                                }}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                        );
                    })}
            </tbody>
        </table>
            <div className='flex justify-center gap-4 text-white mt-2 text-2xl'>
                    <button 
                    className='text-white disabled:text-gray-600' 
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}>
                        <ChevronsLeft/>
                    </button>
                    <button 
                    className='disabled:text-gray-600' 
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}>
                        <ChevronLeft/>
                    </button>
                    <button 
                    className='disabled:text-gray-600' 
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}>
                        <ChevronRight/>
                    </button>
                    <button 
                    className='disabled:text-gray-600' 
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}>
                        <ChevronsRight/>
                    </button>
            </div>
            <div className='text-white text-lg text-center mt-4'>{pagination.pageIndex + 1}</div>
        </div>
    )
}

export default Table;
