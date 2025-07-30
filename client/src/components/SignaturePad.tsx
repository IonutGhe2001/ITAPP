import { useRef, forwardRef, useImperativeHandle } from "react";
import SignatureCanvas from "react-signature-canvas";

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
      return padRef.current.getTrimmedCanvas().toDataURL("image/png");
    },
  }));

  return (
    <SignatureCanvas
      ref={padRef}
      penColor="black"
      backgroundColor="white"
      canvasProps={{
        className: "border border-border rounded-md w-full h-48 bg-background",
      }}
    />
  );
});

export default SignaturePad;