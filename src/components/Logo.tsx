import React from 'react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-primary text-primary-foreground p-1.5 rounded-lg font-black text-xl tracking-tighter">
        XF
      </div>
      <h1 className="font-bold text-xl text-foreground tracking-tight">
        XFuse <span className="text-primary">Portal</span>
      </h1>
    </div>
  );
}
