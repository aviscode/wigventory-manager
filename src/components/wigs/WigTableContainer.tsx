import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import WigTableView from "./WigTableView";

interface WigTableContainerProps {
  searchTerm: string;
}

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
} | null;

const WigTableContainer = ({ searchTerm }: WigTableContainerProps) => {
  const [selectedWig, setSelectedWig] = useState<any | null>(null);
  const [deleteWig, setDeleteWig] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editWigData, setEditWigData] = useState<any>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  console.log('Rendering WigTableContainer');

  const { data: wigs = [], isLoading, error } = useQuery({
    queryKey: ['wigs'],
    queryFn: async () => {
      console.log('Fetching wigs from Supabase...');
      const { data, error } = await supabase
        .from('wigs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching wigs:', error);
        toast.error("Failed to load wigs");
        throw error;
      }
      
      console.log('Fetched wigs:', data);
      return data || [];
    },
  });

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return null;
    });
  };

  const handleFilterChange = (column: string, value: string) => {
    setFilterValues(prev => ({
      ...prev,
      [column]: value
    }));
  };

  const filteredAndSortedWigs = wigs
    .filter(wig => {
      return Object.entries(filterValues).every(([column, value]) => {
        if (!value) return true;
        return String(wig[column]).toLowerCase().includes(value.toLowerCase());
      });
    })
    .filter(wig =>
      wig.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wig.style.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wig.color?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wig.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wig.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortConfig) return 0;
      
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === null) return 1;
      if (bValue === null) return -1;
      
      const comparison = aValue > bValue ? 1 : -1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

  console.log('WigTableContainer loading state:', isLoading);
  console.log('WigTableContainer has data:', wigs.length > 0);
  console.log('Filtered and sorted wigs:', filteredAndSortedWigs);

  return (
    <WigTableView
      wigs={filteredAndSortedWigs}
      isLoading={isLoading}
      error={error}
      selectedWig={selectedWig}
      setSelectedWig={setSelectedWig}
      deleteWig={deleteWig}
      setDeleteWig={setDeleteWig}
      isEditDialogOpen={isEditDialogOpen}
      setIsEditDialogOpen={setIsEditDialogOpen}
      editWigData={editWigData}
      setEditWigData={setEditWigData}
      sortConfig={sortConfig}
      onSort={handleSort}
      filterValues={filterValues}
      onFilterChange={handleFilterChange}
    />
  );
};

export default WigTableContainer;