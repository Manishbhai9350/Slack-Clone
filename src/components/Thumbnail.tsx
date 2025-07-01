/* eslint-disable @next/next/no-img-element */



interface ThumbnailProps {
    url:string | undefined
}

const Thumbnail = ({url}:ThumbnailProps) => {
    return (
        <div className='max-w-[400px] overflow-hidden rounded-md shadow-sm mt-2' >
            <img 
            className="size-full object-cover"
            src={url}
            alt="Image"
            />
        </div>
    );
};

export default Thumbnail