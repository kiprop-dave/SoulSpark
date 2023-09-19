import { Image } from '@/types';
import ImageComponent from '@/components/ImageComponent';

type TeaserProps = {
  image: Pick<Image, 'secure_url'>;
};

export default function Teaser({ image }: TeaserProps): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center w-full h-80 rounded cursor-pointer">
      <ImageComponent imageSrc={image.secure_url} isBlurred rounded="2xl" />
    </div>
  );
}
