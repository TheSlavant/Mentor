import { ImageResponse } from 'next/server';
import Image from 'next/image'
 
export const runtime = 'edge';
 
export async function GET() {
  const imageData = await fetch(new URL('../image.jpg', import.meta.url)).then(
    (res) => res.arrayBuffer(),
  );

  const blob = new Blob([imageData], { type: "image/jpeg" });
  const imageUrl = URL.createObjectURL(blob);
 
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          background: '#f6f6f6',
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image width="256" height="256" src={imageUrl} alt={'The Macintosh Fine-Tune UI'} />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}