import { TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import http from '@/services/http';
import { Upload, Download, Replace, type LucideIcon } from 'lucide-react';

interface Props {
  id: string;
}

type EquipmentChange = {
  id: string;
  tip: 'ASSIGN' | 'RETURN' | 'REPLACE';
  createdAt: string;
  angajat?: { numeComplet: string };
};

const EQUIPMENT_CHANGE_LABELS: Record<EquipmentChange['tip'], string> = {
  ASSIGN: 'Predare',
  RETURN: 'Returnare',
  REPLACE: 'Înlocuire',
};

const EQUIPMENT_CHANGE_ICONS: Record<EquipmentChange['tip'], LucideIcon> = {
  ASSIGN: Upload,
  RETURN: Download,
  REPLACE: Replace,
};

const EQUIPMENT_CHANGE_COLORS: Record<EquipmentChange['tip'], string> = {
  ASSIGN: 'text-green-500',
  RETURN: 'text-blue-500',
  REPLACE: 'text-orange-500',
};

export default function HistoryList({ id }: Props) {
  const PAGE_SIZE = 20;
  const {
    data: historyPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<EquipmentChange[]>({
    queryKey: [...QUERY_KEYS.EQUIPMENT, id, 'history'],
    queryFn: ({ pageParam = 0 }) =>
      http.get<EquipmentChange[]>(
        `/equipment-changes/history/${id}?skip=${pageParam}&take=${PAGE_SIZE}`
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < PAGE_SIZE ? undefined : allPages.length * PAGE_SIZE,
    enabled: !!id,
  });

  const history: EquipmentChange[] = historyPages?.pages.flat() ?? [];

  return (
    <TabsContent value="istoric">
      <div className="space-y-4">
        <h2 className="font-medium">Istoric</h2>
        <Card className="p-4">
          {history.length > 0 ? (
            <div className="space-y-4">
              <ul className="space-y-2 text-sm">
                {history.map((item) => {
                  const Icon = EQUIPMENT_CHANGE_ICONS[item.tip];
                  return (
                    <li key={item.id} className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${EQUIPMENT_CHANGE_COLORS[item.tip]}`} />
                        <span>
                          {EQUIPMENT_CHANGE_LABELS[item.tip]}
                          {item.angajat?.numeComplet && ` - ${item.angajat.numeComplet}`}
                        </span>
                      </span>
                      <span className="text-muted-foreground">
                        {new Date(item.createdAt).toLocaleString('ro-RO')}
                      </span>
                    </li>
                  );
                })}
              </ul>
              {hasNextPage && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? 'Se încarcă...' : 'Încarcă mai mult'}
                </Button>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Nu există istoric disponibil.</p>
          )}
        </Card>
      </div>
    </TabsContent>
  );
}
