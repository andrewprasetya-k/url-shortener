'use client';

export default function Topbar({title}:{title:string}) {
  return (
    <header className="w-full shadow-md p-6 bg-white">
        <h1 className="text-xl font-bold text-gray-700">{title}</h1>
    </header>
  );
}
