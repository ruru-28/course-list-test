// components/course-list/course-list-columns.tsx
'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Search, Copy, Plus, List, Archive } from 'lucide-react';
import React, { useState } from 'react';
import RowActionMenu from '@/components/custom-ui/custom-table/row-action-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { APPS, type CourseWithDetails } from '@/types/courses';

function CompanyCell({ names }: { names: string }) {
  const [expanded, setExpanded] = useState(false);

  if (!names || names === 'None') {
    return <span className="text-gray-400 italic text-sm">None</span>;
  }

  const companies = names.split(', ');
  const displayLimit = 3;

  if (companies.length <= displayLimit) {
    return <span className="text-sm text-gray-700">{names}</span>;
  }

  const displayed = companies.slice(0, displayLimit).join(', ');
  const remaining = companies.slice(displayLimit).join(', ');

  return (
    <div className="text-sm text-gray-700 break-words whitespace-normal">
      {displayed}
      {!expanded && (
        <>
          {' '}
          <span
            className="text-[#FFA600] font-medium cursor-pointer hover:underline whitespace-nowrap"
            onClick={() => setExpanded(true)}
          >
            see more
          </span>
        </>
      )}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          {`, ${remaining}`}
          <br />
          <span
            className="text-[#FFA600] font-medium cursor-pointer hover:underline"
            onClick={() => setExpanded(false)}
          >
            see less
          </span>
        </div>
      </div>
    </div>
  );
}

type Handlers = {
  handleEdit: (course: CourseWithDetails) => void;
  handleDelete: (course: CourseWithDetails) => void;
  handleDuplicate?: (course: CourseWithDetails) => void;
  handleAssign?: (course: CourseWithDetails) => void;
  handleShowJobRoles?: (course: CourseWithDetails) => void;
  handleArchive: (course: CourseWithDetails) => void;
  showPrice?: boolean;
};

export const getCourseListColumns = ({
  handleEdit,
  handleDelete,
  handleDuplicate,
  handleAssign,
  handleShowJobRoles,
  handleArchive,
  showPrice = false,
}: Handlers): ColumnDef<CourseWithDetails>[] => {

  const columns: ColumnDef<CourseWithDetails>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <div className="flex items-center justify-center w-full">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="border-gray-300"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center w-full">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="border-gray-300 group-hover:border-[var(--primary)]"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      meta: { width: '4%' },
    },
    {
      accessorKey: 'id',
      header: 'ID',
      enableSorting: true,
      meta: { width: '7%' },
      cell: ({ row }) => <span className="text-gray-900 font-medium">{row.original.id}</span>,
    },
    {
      accessorKey: 'name',
      header: 'Course Name',
      enableSorting: true,
      meta: { width: '29%' },
      cell: ({ row }) => <span className="text-gray-900 font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: 'assignedCompanies',
      header: 'Company',
      enableSorting: true,
      meta: { width: '33%' },
      cell: ({ row }) => <CompanyCell names={row.original.assignedCompanies} />,
    },
    {
      accessorKey: 'totalUnits',
      header: 'Total Units',
      enableSorting: true,
      meta: { width: '9%' },
      cell: ({ row }) => <span className="text-gray-600">{row.original.totalUnits}</span>,
    },
  ];

  if (showPrice) {
    columns.push({
      accessorKey: 'price',
      header: 'Price',
      enableSorting: true,
      meta: { width: '10%' },
      cell: ({ row }) => {
        const price = row.original.price;
        const isPaid = row.original.is_paid;

        if (!isPaid || price === null || price === 0) {
          return (
            <span className="text-[#FFA600] font-medium">
              Free
            </span>
          );
        }

        return (
          <span className="text-gray-600">
            ${price.toFixed(2)}
          </span>
        );
      },
    });
  }

  columns.push({
    id: 'actions',
    meta: { width: '8%' },
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const menuItems = [];

      menuItems.push({
        label: 'View Course',
        icon: <Search size={16} />,
        onClick: () => handleEdit(row.original),
      });

      menuItems.push({
        label: 'Edit Course',
        icon: <Pencil size={16} />,
        onClick: () => handleEdit(row.original),
      });

      if (handleDuplicate) {
        menuItems.push({
          label: 'Duplicate Course',
          icon: <Copy size={16} />,
          onClick: () => handleDuplicate(row.original),
        });
      }

      menuItems.push({
        label: 'Add to Company or Job Role',
        icon: <Plus size={16} />,
        onClick: () => handleAssign?.(row.original),
      });

      menuItems.push({
        label: 'Show Job Roles',
        icon: <List size={16} />,
        onClick: () => handleShowJobRoles?.(row.original),
      });

      menuItems.push({
        label: 'Archive Course',
        icon: <Archive size={16} />,
        onClick: () => handleArchive(row.original),
      });

      return (
        <div className="flex justify-center">
          <RowActionMenu
            app={APPS.TRAINING}
            menuItems={menuItems}
          />
        </div>
      );
    },
  });

  return columns;
};
