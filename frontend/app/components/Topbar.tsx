'use client';

export default function Topbar({title}:{title:string}) {
  return (
    <header className="w-full p-6 bg-white fixed z-10">
        <h1 className="text-xl font-bold text-gray-700">{title}</h1>
    </header>
  );
}
