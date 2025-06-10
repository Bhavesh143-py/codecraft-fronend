import { useReactFlow } from 'reactflow';
import zoomInIcons from "./assets/zoomIn.svg"
import zoomOutIcons from "./assets/zoomOut.svg"
import fitViewIcons from "./assets/fitView.svg"

export default function CustomControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <div className="flex flex-row gap-5 items-center justify-center bg-white rounded-lg text-white absolute bottom-8 left-8 z-10 w-[135px] h-[46px] ">
      <img
        src={zoomInIcons}
        alt="Zoom In"
        onClick={zoomIn}
        className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform"
      />
      <img
        src={zoomOutIcons}
        alt="Zoom Out"
        onClick={zoomOut}
        className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform"
      />
      <img
        src={fitViewIcons}
        alt="Fit View"
        onClick={fitView}
        className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform"
      />
    </div>
  );
}