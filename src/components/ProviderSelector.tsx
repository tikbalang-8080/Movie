
import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Provider, providers, setFavoriteProvider } from '@/utils/providers';

interface ProviderSelectorProps {
  selectedProvider: Provider;
  onSelectProvider: (provider: Provider) => void;
}

const ProviderSelector: React.FC<ProviderSelectorProps> = ({ 
  selectedProvider, 
  onSelectProvider 
}) => {
  const [open, setOpen] = useState(false);
  
  const handleSelect = (provider: Provider) => {
    onSelectProvider(provider);
    setFavoriteProvider(provider.id);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="w-full justify-between font-normal rounded-lg border-halo-200"
        >
          <span className="truncate mr-1">{selectedProvider.name}</span>
          <ChevronDown size={16} className="opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="center" 
        className="w-56 max-h-[50vh] overflow-auto"
      >
        {providers.map((provider) => (
          <DropdownMenuItem
            key={provider.id}
            className="cursor-pointer gap-2"
            onSelect={() => handleSelect(provider)}
          >
            <div className="flex items-center justify-between w-full">
              <span>{provider.name}</span>
              {provider.id === selectedProvider.id && (
                <Check size={16} className="text-green-600" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProviderSelector;
