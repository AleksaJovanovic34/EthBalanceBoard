import '../assets/styles/table.css'
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import React from 'react';
import Blockie from './ui/blockies';
import { Copy, Check } from 'lucide-react'

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
            cell: ({ cell}) => (
                <AdressCell value={cell.getValue()}/>
            ),
        },
        {
            accessorKey: 'name',
            header: 'Name Tag',
            cell: (props) => <p>{props.getValue()}</p>
        },
        {
            accessorKey: 'eth',
            header: 'ETH',
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
            cell: (props) => {
                const value = props.getValue()
                return (
                    <span>
                        {typeof value === 'number' ? value.toLocaleString('en-US', {style: 'currency', currency:'USD'}) : '-'}
                    </span>
                )
            }
            
        },
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    
    return (
        <table className='table'>
            <thead className='table-header-group w-full text-white border-b border-b-gray-600'>
                {table.getHeaderGroups().map(headerGroup => 
                    <tr key={headerGroup.id} className='table-row'>
                        {headerGroup.headers.map(header => 
                            <td key={header.id} 
                            className='table-cell px-10 py-2'>
                                {header.column.columnDef.header}
                            </td>
                        )}
                    </tr>)}
            </thead>
            <tbody className='table-row-group'>
                {table.getRowModel().rows.map(row => {
                    return(
                        <tr key={row.id} 
                        className='table-row border-b border-b-gray-500'>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} 
                                className={`table-cell py-2 px-10`}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                        );
                    })}
            </tbody>
        </table>
    )
}

export default Table;
