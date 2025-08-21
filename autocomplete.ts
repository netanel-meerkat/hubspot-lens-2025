// autocomplete.ts - Token autocomplete module

export function attachTokenAutocomplete(opts: {
  input: HTMLInputElement;
  list: HTMLUListElement;
  chips: HTMLElement;
  getItems: () => Promise<string[]>;
  onChange: (values: string[]) => void;
  initial?: string[];
}): void {
  let all: string[] = [];
  let selected = new Set<string>(opts.initial || []);
  renderChips();

  opts.getItems().then(items => { all = items; });

  let idx = -1, filtered: string[] = [];
  const debounce = (fn: Function, d=150)=>{ let t: any; return (...a: any[])=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), d); }; };
  const update = debounce(() => {
    const q = opts.input.value.trim().toLowerCase();
    filtered = !q ? all.slice(0,50) : all.filter(p=>p.toLowerCase().includes(q)).slice(0,50);
    renderList();
  });

  opts.input.addEventListener('input', update);
  opts.input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown'){ e.preventDefault(); idx = Math.min(idx+1, filtered.length-1); highlight(); }
    else if (e.key === 'ArrowUp'){ e.preventDefault(); idx = Math.max(idx-1, 0); highlight(); }
    else if (e.key === 'Enter'){ e.preventDefault(); if(filtered[idx]) add(filtered[idx]); }
    else if (e.key === 'Backspace' && opts.input.value === '') { removeLast(); }
    else if (e.key === 'Escape'){ closeList(); }
  });

  opts.list.addEventListener('mousedown', (e) => {
    const li = (e.target as HTMLElement).closest('li[data-value]') as HTMLLIElement | null;
    if (li) add(li.dataset.value!);
  });

  function add(val: string){
    if (!val || selected.has(val)) return;
    selected.add(val);
    opts.onChange([...selected]);
    opts.input.value=''; idx=-1; filtered=[]; renderChips(); closeList();
  }
  function remove(val: string){ selected.delete(val); opts.onChange([...selected]); renderChips(); }
  function removeLast(){ const last=[...selected].pop(); if(last) remove(last); }
  function renderChips(){
    opts.chips.innerHTML='';
    [...selected].forEach(v=>{
      const span=document.createElement('span'); span.className='chip'; span.textContent=v+' ';
      const btn=document.createElement('button'); btn.type='button'; btn.setAttribute('aria-label','Remove'); btn.textContent='×';
      btn.addEventListener('click', ()=>remove(v));
      span.appendChild(btn); opts.chips.appendChild(span);
    });
  }
  function renderList(){
    opts.list.innerHTML=''; idx = filtered.length ? 0 : -1;
    filtered.forEach(v=>{
      const li=document.createElement('li'); li.textContent=v; li.dataset.value=v; li.setAttribute('role','option');
      opts.list.appendChild(li);
    });
    opts.list.hidden = filtered.length === 0;
    opts.input.setAttribute('aria-expanded', String(!opts.list.hidden));
    highlight();
  }
  function highlight(){
    [...opts.list.children].forEach((el,i)=> el.classList.toggle('active', i===idx));
  }
  function closeList(){ opts.list.hidden = true; opts.input.setAttribute('aria-expanded','false'); }
}
