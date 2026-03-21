import Image from 'next/image';

interface Props{
    title: string;
    description: string;
    imgSrc?: string;
}


const EmptyState = ({title, description, imgSrc}: Props) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
        <Image src={imgSrc!} alt={title} width={192} height={192} className='mb-4' />
        <h2 className='text-xl font-semibold text-gray-500'>
            {title}
        </h2>
        <p className='text-gray-400'>
            {description}
        </p>
    </div>
  )
}

export default EmptyState