import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const Topbar = () => {
  const { setSidebarOpen } = useStore();

  return (
    <div className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-muted-foreground lg:hidden hover:text-foreground"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex flex-1 items-center justify-end gap-x-4 lg:justify-between lg:gap-x-6">
        <div className="flex-1 lg:flex-none">
          <form className="relative flex w-full max-w-sm" action="#" method="GET">
            <label htmlFor="search-field" className="sr-only">Search</label>
            <Search
              className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-muted-foreground pl-3"
              aria-hidden="true"
            />
            <input
              id="search-field"
              className="block h-10 w-full rounded-md border-0 py-0 pl-10 pr-0 text-foreground text-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm bg-muted/50"
              placeholder="Search..."
              type="search"
              name="search"
            />
          </form>
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" className="-m-2.5 p-2.5 text-muted-foreground hover:text-foreground">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
          </button>
          
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" aria-hidden="true" />
          
          <div className="flex items-center gap-x-4 cursor-pointer">
            <img
              className="h-8 w-8 rounded-full bg-muted object-cover"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User avatar"
            />
            <span className="hidden lg:flex lg:items-center text-sm font-semibold leading-6 text-foreground">
              Mohamed Saied
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
