/* eslint-disable @next/next/no-img-element */

import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

interface ThumbnailProps {
  url: string | undefined;
}

const Thumbnail = ({ url }: ThumbnailProps) => {
  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer">
        <div className="max-w-[400px] overflow-hidden rounded-md shadow-sm mt-2">
          <img className="size-full object-cover" src={url} alt="Image" />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[800px]">
        <div className="size-full overflow-hidden rounded-md shadow-sm mt-2">
          <img className="size-full object-cover" src={url} alt="Image" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Thumbnail;
