import React, { useState } from 'react';
import { useTaskContext } from '../contextTaskContext';
import TaskItem from '../TaskItem';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import { Priority } from '@/types/task';
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel,DropdownMenuSeparator,DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';

type FilterStatus = 'all' | 'active' | 'completed';
type SortOption = 'newest' | 'oldest' | 'dueDate' | 'priority';

const TaskList: React.FC = () => {
  const { tasks } = useTaskContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | Priority>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Derived state
  const completedCount = tasks.filter(task => task.completed).length;
  const activeCount = tasks.length - completedCount;
  const hasActiveFilters = searchTerm || filterStatus !== 'all' || filterPriority !== 'all' || sortBy !== 'newest';

  // Filter and sort tasks
  const filteredAndSortedTasks = getFilteredAndSortedTasks(
    tasks,
    searchTerm,
    filterStatus,
    filterPriority,
    sortBy
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterPriority('all');
    setSortBy('newest');
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Section */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap md:flex-nowrap gap-2">
          <StatusFilter 
            value={filterStatus}
            onChange={setFilterStatus}
            tasksCount={tasks.length}
            activeCount={activeCount}
            completedCount={completedCount}
          />
          
          <PriorityFilter 
            value={filterPriority}
            onChange={setFilterPriority}
          />
          
          <SortDropdown 
            currentSort={sortBy}
            onSortChange={setSortBy}
          />
          
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              onClick={clearAllFilters} 
              className="flex-shrink-0"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
      
      {/* Task List Section */}
      {filteredAndSortedTasks.length > 0 ? (
        <div className="space-y-2">
          {filteredAndSortedTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <EmptyState hasTasks={tasks.length > 0} />
      )}
    </div>
  );
};

// Helper components for better organization
const StatusFilter: React.FC<{
  value: FilterStatus;
  onChange: (value: FilterStatus) => void;
  tasksCount: number;
  activeCount: number;
  completedCount: number;
}> = ({ value, onChange, tasksCount, activeCount, completedCount }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="flex-grow">
      <SelectValue placeholder="Filter by status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Tasks ({tasksCount})</SelectItem>
      <SelectItem value="active">Active ({activeCount})</SelectItem>
      <SelectItem value="completed">Completed ({completedCount})</SelectItem>
    </SelectContent>
  </Select>
);

const PriorityFilter: React.FC<{
  value: 'all' | Priority;
  onChange: (value: 'all' | Priority) => void;
}> = ({ value, onChange }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="flex-grow">
      <SelectValue placeholder="Filter by priority" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Priorities</SelectItem>
      <SelectItem value="low">Low</SelectItem>
      <SelectItem value="medium">Medium</SelectItem>
      <SelectItem value="high">High</SelectItem>
    </SelectContent>
  </Select>
);

const SortDropdown: React.FC<{
  currentSort: SortOption;
  onSortChange: (value: SortOption) => void;
}> = ({ currentSort, onSortChange }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className="flex-grow">
        <Filter className="mr-2 h-4 w-4" />
        Sort By
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {(['newest', 'oldest', 'dueDate', 'priority'] as SortOption[]).map((option) => (
        <DropdownMenuItem 
          key={option} 
          onClick={() => onSortChange(option)}
        >
          {currentSort === option && '✓ '}
          {getSortOptionLabel(option)}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

const EmptyState: React.FC<{ hasTasks: boolean }> = ({ hasTasks }) => (
  <div className="text-center py-10">
    <p className="text-gray-500">
      {hasTasks ? "No tasks match your filters. Try adjusting them." : "No tasks found. Create your first task!"}
    </p>
  </div>
);

// Utility functions for filtering and sorting
const getFilteredAndSortedTasks = (
  tasks: Task[],
  searchTerm: string,
  filterStatus: FilterStatus,
  filterPriority: 'all' | Priority,
  sortBy: SortOption
) => {
  const filtered = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'active' && !task.completed) || 
      (filterStatus === 'completed' && task.completed);
    
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return sortTasks(filtered, sortBy);
};

const sortTasks = (tasks: Task[], sortBy: SortOption) => {
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'dueDate':
        return compareDueDates(a.dueDate, b.dueDate);
      case 'priority':
        return comparePriorities(a.priority, b.priority);
      default:
        return 0;
    }
  });
};

const compareDueDates = (a?: Date, b?: Date) => {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return a.getTime() - b.getTime();
};

const comparePriorities = (a: Priority, b: Priority) => {
  const priorityOrder = { high: 1, medium: 2, low: 3 };
  return priorityOrder[a] - priorityOrder[b];
};

const getSortOptionLabel = (option: SortOption) => {
  switch (option) {
    case 'newest': return 'Newest First';
    case 'oldest': return 'Oldest First';
    case 'dueDate': return 'Due Date';
    case 'priority': return 'Priority';
    default: return '';
  }
};

export default TaskList;