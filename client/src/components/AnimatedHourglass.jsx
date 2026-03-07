export default function AnimatedHourglass({ className = '' }) {
  return (
    <video
      className={`w-full h-full object-cover ${className}`}
      src={`${import.meta.env.BASE_URL}videos/hourglass.mp4`}
      autoPlay
      muted
      playsInline
      loop={false}
    />
  )
}
