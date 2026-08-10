'use client';

import { useCallback, useEffect, useState } from 'react';
import { getAdminCurriculum, AdminCurriculumLevel } from '@/lib/admin-services';

export function useAdminCurriculum() {
  const [levels, setLevels] = useState<AdminCurriculumLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    return getAdminCurriculum()
      .then(setLevels)
      .catch(() => {
        setError('Сургалтын бүтэц ачаалахад алдаа гарлаа');
        return [] as AdminCurriculumLevel[];
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { levels, loading, error, reload };
}
