import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import the implementation with SSR disabled.
// This prevents 'window is not defined' errors from react-plotly.js and ensures
// the library only loads on the client.
const PivotTableV2Impl = dynamic(() => import('./pivotTableV2Impl'), {
  ssr: false,
  loading: () => <div className="p-4 text-center text-gray-500 text-sm">Loading Chart...</div>,
});

interface PivotTableV2Props {
  data?: unknown[];
  onSave?: (state: unknown) => void;
  onCancel?: () => void;
  readOnly?: boolean;
  initialState?: unknown;
}

const PivotTableV2 = (props: PivotTableV2Props) => {
  return <PivotTableV2Impl {...props} />;
};

export default PivotTableV2;
