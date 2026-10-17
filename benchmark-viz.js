(() => {
  const NS='http://www.w3.org/2000/svg', total=5238;
  const genres=[
    {name:'Action',count:3834,color:'#819e58',subs:[['Action Adventure',1533],['Shooter',1368],['Survival',264],['Fighting',260],['Battle Royale',163],['Stealth',133],['Platform',71],['Wargame',30],['Rhythm',12]]},
    {name:'Simulation',count:974,color:'#a48ac1',subs:[['Vehicle Simulation',510],['Construction & Management',258],['Sports',140],['Life Simulation',66]]},
    {name:'RPG',count:313,color:'#c7ac68',subs:[['Action RPG',264],['Dungeon Crawl',20],['MMORPG',19],['Roguelike',10]]},
    {name:'Strategy',count:60,color:'#78a5a0',subs:[['Real-time Tactics',30],['Turn-based Strategy',30]]},
    {name:'Puzzle',count:47,color:'#c98d7b',subs:[['Puzzle',47]]},
    {name:'Adventure',count:10,color:'#8598c2',subs:[['Interactive Film',10]]}
  ];
  const chart=document.querySelector('#genre-chart'),legend=document.querySelector('#genre-legend'),detail=document.querySelector('#genre-detail'),reset=document.querySelector('#genre-reset');
  let selected=null;
  function svg(tag,attrs={}){const el=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));return el;}
  function point(r,a){return [160+r*Math.cos(a),160+r*Math.sin(a)];}
  function arc(a,b){const sweep=Math.min(b-a,Math.PI*2-.00001),end=a+sweep;const p1=point(135,a),p2=point(135,end),p3=point(88,end),p4=point(88,a);return `M${p1} A135 135 0 ${sweep>Math.PI?1:0} 1 ${p2} L${p3} A88 88 0 ${sweep>Math.PI?1:0} 0 ${p4} Z`;}
  function summary(item){return `${item.name} · ${item.count.toLocaleString()} videos · ${(item.count/total*100).toFixed(2)}% of benchmark${selected?` · ${(item.count/selected.count*100).toFixed(1)}% of ${selected.name}`:''}`;}
  function defaultDetail(){return '';}
  function highlight(index){chart.querySelectorAll('.genre-slice').forEach((el,i)=>el.classList.toggle('muted',index!==null&&i!==index));legend.querySelectorAll('button').forEach((el,i)=>el.classList.toggle('is-highlighted',index===i));}
  function render(){chart.replaceChildren();legend.replaceChildren();reset.hidden=!selected;chart.setAttribute('aria-label',selected?`${selected.name} subgenre video distribution`:'Video distribution across six game genres');let data=selected?selected.subs.map(([name,count],i)=>({name,count,color:selected.color,opacity:.5+.5*(1-i/Math.max(selected.subs.length,1))})):genres;
    const sum=selected?selected.count:total;let angle=-Math.PI/2;
    data.forEach((item,i)=>{const end=angle+item.count/sum*Math.PI*2;const path=svg('path',{d:arc(angle,end),fill:item.color,'fill-opacity':item.opacity||1,tabindex:0,role:'button','aria-label':summary(item)+(selected?'':', show subgenres'),class:'genre-slice'});const title=svg('title');title.textContent=summary(item);path.append(title);chart.append(path);angle=end;
      const button=document.createElement('button');button.className='genre-key';button.style.setProperty('--genre-color',item.color);const name=document.createElement('span');name.className='genre-key-name';name.textContent=item.name;const number=document.createElement('span');number.className='genre-key-count';number.textContent=`${item.count.toLocaleString()} · ${(item.count/total*100).toFixed(2)}%`;button.append(name,number);button.setAttribute('aria-label',summary(item)+(selected?'':', show subgenres'));legend.append(button);
      function show(){highlight(i);detail.textContent=summary(item);}function clear(){highlight(null);detail.textContent=defaultDetail();}function choose(){if(!selected){selected=genres[i];render();reset.focus({preventScroll:true});}else{show();}}
      [path,button].forEach(el=>{el.addEventListener('pointerenter',show);el.addEventListener('pointerleave',clear);el.addEventListener('focus',show);el.addEventListener('blur',clear);el.addEventListener('click',choose)});path.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();}});
    });
    const count=svg('text',{x:160,y:154,'text-anchor':'middle',class:'donut-count'});count.textContent=sum.toLocaleString();const label=svg('text',{x:160,y:178,'text-anchor':'middle',class:'donut-label'});label.textContent=selected?selected.name:'VIDEOS';chart.append(count,label);detail.textContent=defaultDetail();
  }
  reset.onclick=()=>{selected=null;render();legend.querySelector('button')?.focus({preventScroll:true});};render();
  const wordSVG=document.querySelector('#word-cloud');
  function clearWordHover(){wordSVG.querySelectorAll('.is-word-active').forEach(word=>word._setHover?.(false));}
  function checkWordPointer(event){const active=wordSVG.querySelector('.is-word-active');if(active&&!active.contains(event.target))clearWordHover();}
  document.addEventListener('pointermove',checkWordPointer,{passive:true});document.addEventListener('pointerdown',checkWordPointer,{passive:true});document.addEventListener('click',checkWordPointer);wordSVG.addEventListener('pointerleave',clearWordHover);window.addEventListener('scroll',clearWordHover,{passive:true});window.addEventListener('blur',clearWordHover);

  const cloudPalette=['#735c91','#53773f','#4f8c87','#917948','#7a6259','#779348'];
  const majorColors={animation:'#82649f',collision:'#527740',physics:'#77625b',engine:'#4f8e89',air:'#77625b',behavior:'#567c43',unnatural:'#859748',vehicle:'#82649f',movement:'#7c6359'};
  function buildCloud(data){
    const width=1600,height=1000;
    // Reference emphasis, not invented corpus counts. Strong tiers avoid flattening the hierarchy.
    const emphasis={physics:250,collision:230,animation:210,engine:190,air:150,behavior:140,unnatural:126,vehicle:112,movement:108,interaction:96,system:88,floating:86,rendering:84,stuck:80,unnaturally:80,ground:76,model:74,car:74,clipping:68,environment:66,unrealistic:66};
    const words=data.words.map((word,index)=>({text:word.word,size:emphasis[word.word]||Math.max(23,Math.min(58,Math.sqrt(word.w*word.h)/4.5)),vertical:word.h>word.w*1.25,index}));
    wordSVG.replaceChildren();wordSVG.setAttribute('viewBox',`0 0 ${width} ${height}`);wordSVG.setAttribute('aria-label','Word cloud of all the bug descriptions.');
    let attempt=0;
    function arrange(){
      let seed=89421;
      function random(){seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296;}
      const scale=Math.pow(.94,attempt);
      const layout=d3.layout.cloud().size([width,height]).words(words.map(word=>({...word,size:word.size*scale}))).font('IBM Plex Mono').fontWeight(500).fontSize(word=>word.size).rotate(word=>word.vertical&&word.size<100?-90:0).padding(word=>word.size>100?4:2).spiral('archimedean').random(random).timeInterval(12);
      layout.on('end',placed=>{
        // Repack the whole cloud uniformly if space is tight; preserve every size ratio.
        if(placed.length<words.length&&attempt<5){attempt++;arrange();return;}
        const group=svg('g',{transform:`translate(${width/2} ${height/2})`});
        placed.forEach(word=>{
          const anchor=svg('g',{transform:`translate(${word.x} ${word.y}) rotate(${word.rotate})`,class:'cloud-word-anchor','data-word':word.text});
          const text=svg('text',{'font-family':'IBM Plex Mono','font-size':word.size,'font-weight':500,'text-anchor':'middle',fill:majorColors[word.text]||cloudPalette[word.index%cloudPalette.length],class:'professional-cloud-word',tabindex:0,role:'img','aria-label':word.text});
          text.textContent=word.text;anchor.append(text);group.append(anchor);
          // One explicit animation controller; reversals start at the visible scale.
          anchor._setHover=function(active){
            if(anchor.classList.contains('is-word-active')===active)return;
            const from=getComputedStyle(text).transform;
            if(anchor._wordAnimation)anchor._wordAnimation.cancel();
            anchor.classList.toggle('is-word-active',active);
            if(active)group.append(anchor);
            const to=active?'scale(1.075)':'scale(1)';
            text.style.transform=to;
            if(matchMedia('(prefers-reduced-motion: reduce)').matches){text.style.transform='scale(1)';return;}
            anchor._wordAnimation=text.animate([{transform:from==='none'?'scale(1)':from},{transform:to}],{duration:380,easing:'cubic-bezier(.22,.61,.36,1)',fill:'none'});
          };
          anchor.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch')anchor._setHover(true)});
          anchor.addEventListener('pointerleave',()=>anchor._setHover(false));
          anchor.addEventListener('pointercancel',()=>anchor._setHover(false));

        });
        wordSVG.replaceChildren(group);wordSVG.dataset.placed=String(placed.length);wordSVG.dataset.total=String(words.length);wordSVG.dataset.layout='d3-cloud-1.2.7';
      });layout.start();
    }
    arrange();
  }
  Promise.all([fetch('data/wordcloud-layout.json').then(response=>{if(!response.ok)throw Error(response.status);return response.json()}),document.fonts.ready]).then(([data])=>buildCloud(data)).catch(()=>{const message=svg('text',{x:20,y:80,fill:'#667458','font-size':16});message.textContent='Word cloud could not load. Please refresh.';wordSVG.append(message)});
})();
