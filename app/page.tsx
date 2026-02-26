// app/page.tsx
'use client';

import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { Plus, Archive, InfoIcon } from 'lucide-react';

import CustomButton from '@/components/custom-ui/custom-button';
import CustomDeleteDialog from '@/components/custom-ui/custom-delete-dialog';
import { CustomTable } from '@/components/custom-ui/custom-table/custom-table';
import { TablePagination } from '@/components/custom-ui/custom-table/table-pagination';
import PageInfoBanner from '@/components/PageInfoBanner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { APPS } from '@/types/courses';

import { getCourseListColumns } from '@/components/course-list/course-list-columns';
import { useCoursesTable, ActionType } from '@/hooks/useCoursesTable';

export default function CoursesPage() {
  const {
    state,
    dispatch,
    handleDeleteCourse,
    handleDuplicateCourse,
    handleArchiveCourse,
    handleBulkArchive,
    onBulkArchiveConfirm,
    setSorting,
    setPagination,
    setGlobalFilter,
    setRowSelection,
    setColumnFilters,
    selectedCount,
    handlers
  } = useCoursesTable([]);

  const {
    courses,
    isLoading,
    sorting,
    pagination,
    rowSelection,
    globalFilter,
    columnFilters,
    deleteDialogOpen,
    duplicateDialogOpen,
    archiveDialogOpen,
    bulkArchiveDialogOpen,
    selectedCourse,
    isProcessing,
  } = state;

  const columns = useMemo(
    () =>
      getCourseListColumns({
        handleEdit: (course) => {
           console.log('Edit course clicked:', course.id);
        },
        handleDelete: (course) => {
          dispatch({ type: ActionType.OPEN_DELETE_DIALOG, payload: course });
        },
        handleDuplicate: (course) => {
          dispatch({ type: ActionType.OPEN_DUPLICATE_DIALOG, payload: course });
        },
        handleArchive: handlers.handleOpenArchiveDialog,
        handleAssign: undefined,
        handleShowJobRoles: undefined,
        showPrice: true,
      }),
    [dispatch, handlers.handleOpenArchiveDialog]
  );

  const table = useReactTable({
    data: courses,
    columns,
    state: { sorting, pagination, globalFilter, rowSelection, columnFilters },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    autoResetPageIndex: false,
    enableRowSelection: true,
  });

  return (
    <>
      <div className="p-4 md:p-6 bg-gray-50">
        <PageInfoBanner
          title="Active Courses List"
          subtitle="List of active courses available on the platform."
        />

        {/* Controls: Results Count, Bulk Actions & Add Button */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50 p-2 rounded-md mb-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>Show</span>
              <Select
                value={String(pagination.pageSize)}
                onValueChange={(val) => table.setPageSize(Number(val))}
              >
                <SelectTrigger className="h-8 w-[70px] bg-white">
                  <SelectValue placeholder={pagination.pageSize} />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 50].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>of {table.getFilteredRowModel().rows.length} results</span>
            </div>

            <div className="h-6 w-px bg-gray-300 mx-2" />

            <button
              onClick={handleBulkArchive}
              disabled={selectedCount === 0}
              className={cn(
                "flex items-center gap-2 transition-colors font-medium text-sm",
                selectedCount > 0
                  ? "text-gray-600 hover:text-[#FFA600] cursor-pointer"
                  : "text-gray-400 cursor-not-allowed"
              )}
            >
              <Archive size={16} />
              <span>Archive</span>
            </button>
          </div>

          <CustomButton
            title="Add Course"
            onClick={() => console.log('Add Course Clicked')}
            leadingIcon={<Plus size={18} />}
            app={APPS.TRAINING}
          />
        </div>

        <CustomTable
          table={table}
          isLoading={isLoading}
          noResultsMessage="No courses found."
          skeletonRows={pagination.pageSize}
          containerClassName="border border-[var(--table-border)] rounded-md overflow-auto"
          headerRowClassName="bg-[#EAECEF] border-b border-[var(--table-border)]"
          headerCellClassName="text-gray-700 font-semibold text-sm px-4 py-3 h-12 border-r border-[var(--table-border)] last:border-r-0"
          bodyRowClassName="hover:bg-[var(--highlight)] hover:text-[var(--primary)] transition-colors"
          bodyCellClassName="px-4 py-3 text-sm text-gray-600 border-r border-[var(--table-border)] last:border-r-0 group-hover:border-[var(--primary)] group-hover:text-[var(--primary)]"
        />

        <TablePagination table={table} app={APPS.TRAINING} />
      </div>

      {/* Dialogs */}
      <CustomDeleteDialog
        isOpen={deleteDialogOpen}
        setIsOpen={() => dispatch({ type: ActionType.CLOSE_DELETE_DIALOG })}
        onDelete={handleDeleteCourse}
        title="Delete Course"
        message={`Are you sure you want to delete "${selectedCourse?.name}"?`}
        description="This action cannot be undone."
        isLoading={isProcessing}
        onDeleteTitle="Delete"
        app={APPS.TRAINING}
        confirmButtonVariant="destructive"
      />

      <CustomDeleteDialog
        isOpen={duplicateDialogOpen}
        setIsOpen={() => dispatch({ type: ActionType.CLOSE_DIALOGS })}
        onDelete={handleDuplicateCourse}
        title="Duplicate Course"
        message="Are you sure you want to duplicate this course?"
        description="This will create an exact copy of the course."
        isLoading={isProcessing}
        onDeleteTitle="Confirm"
        cancelButtonText="Cancel"
        app={APPS.TRAINING}
        confirmButtonVariant="default"
        icon={<InfoIcon className="text-[#FFA600] h-5 w-5" />}
      />

      <CustomDeleteDialog
        isOpen={archiveDialogOpen}
        setIsOpen={() => dispatch({ type: ActionType.CLOSE_DIALOGS })}
        onDelete={handleArchiveCourse}
        title="Archive Course?"
        message={`Are you sure you want to archive "${selectedCourse?.name}"?`}
        description="This course will be moved to the archive."
        isLoading={isProcessing}
        onDeleteTitle="Archive"
        app={APPS.TRAINING}
        confirmButtonVariant="default"
      />

      <CustomDeleteDialog
        isOpen={bulkArchiveDialogOpen}
        setIsOpen={() => dispatch({ type: ActionType.CLOSE_DIALOGS })}
        onDelete={onBulkArchiveConfirm}
        title="Archive Selected Courses?"
        message={`Are you sure you want to archive ${selectedCount} course(s)?`}
        description="These courses will be moved to the archive."
        isLoading={isProcessing}
        onDeleteTitle="Archive All"
        app={APPS.TRAINING}
        confirmButtonVariant="default"
      />
    </>
  );
}
