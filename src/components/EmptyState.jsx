import { useEffect } from 'react';
import { useRive } from '@rive-app/react-canvas';

export default function EmptyState({ message = 'No records found.' }) {
  const { RiveComponent, rive } = useRive({
    src: '/search-emp.riv',
    autoplay: true,
  });

  useEffect(() => {
    if (!rive) return;
    const onStop = () => rive.play();
    rive.on('stop', onStop);
    return () => rive.off('stop', onStop);
  }, [rive]);

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-40 h-40">
        <RiveComponent />
      </div>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
