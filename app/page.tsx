import { Universe } from '@/components/universe/Universe'

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-indigo-600 focus:shadow-lg"
      >
        Skip to main content
      </a>
      <Universe />
    </>
  )
}
