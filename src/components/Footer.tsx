import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 hotdog:bg-hotdog-bun py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center">          <p className="text-sm text-gray-600 dark:text-gray-400 hotdog:text-black">Recipe card design inspired by{' '}            <Link 
              href="https://codepen.io/michmy/pen/GrzwVL"
              className="text-blue-600 dark:text-blue-400 hotdog:text-hotdog-red hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Michelle&apos;s Recipe Card Design
            </Link>
            {' '}on CodePen
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 hotdog:text-black mt-2">
            Built with Next.js, Azure OpenAI, and now with Hot Dog mode!
          </p>
        </div>
      </div>
    </footer>
  );
}
