import { useRef, forwardRef, useImperativeHandle } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import trimCanvasModule from 'trim-canvas';

type TrimCanvas = (canvas: HTMLCanvasElement) => HTMLCanvasElement;

const trimCanvas: TrimCanvas =
  (trimCanvasModule as unknown as { default: TrimCanvas }).default ??
  (trimCanvasModule as unknown as TrimCanvas);

export interface SignaturePadHandle {
  clear: () => void;
  getImage: () => string | null;
}

const SignaturePad = forwardRef<SignaturePadHandle>((_props, ref) => {
  const padRef = useRef<SignatureCanvas>(null);

  useImperativeHandle(ref, () => ({
    clear: () => {
      padRef.current?.clear();
    },
    getImage: () => {
      if (!padRef.current || padRef.current.isEmpty()) return null;
      const canvas = padRef.current.getCanvas();
      const trimmed = trimCanvas(canvas);
      return trimmed.toDataURL('image/png');
    },
  }));

  return (
    <SignatureCanvas
      ref={padRef}
      penColor="black"
      backgroundColor="white"
      canvasProps={{
        className: 'border border-border rounded-md w-full h-48 bg-background',
      }}
    />
  );
});

export default SignaturePad;
