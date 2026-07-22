const fs = require('fs');
const path = require('path');

const chapters = [
  { id: 'chapter-00-loading', title: 'Cinematic Loader', desc: 'Introduction and loading screen.' },
  { id: 'chapter-01-home', title: 'Home', desc: 'Landing home screen.' },
  { id: 'chapter-02', title: 'Chapter 2', desc: 'Chapter 2 placeholder.' },
  { id: 'chapter-03', title: 'Chapter 3', desc: 'Chapter 3 placeholder.' },
  { id: 'chapter-04', title: 'Chapter 4', desc: 'Chapter 4 placeholder.' },
  { id: 'chapter-05', title: 'Chapter 5', desc: 'Chapter 5 placeholder.' },
  { id: 'chapter-06', title: 'Chapter 6', desc: 'Chapter 6 placeholder.' },
  { id: 'chapter-07', title: 'Chapter 7', desc: 'Chapter 7 placeholder.' },
  { id: 'chapter-08', title: 'Chapter 8', desc: 'Chapter 8 placeholder.' },
  { id: 'chapter-09', title: 'Chapter 9', desc: 'Chapter 9 placeholder.' },
  { id: 'chapter-10', title: 'Chapter 10', desc: 'Chapter 10 placeholder.' },
  { id: 'chapter-11', title: 'Chapter 11', desc: 'Chapter 11 placeholder.' },
  { id: 'chapter-12', title: 'Chapter 12', desc: 'Chapter 12 placeholder.' },
  { id: 'chapter-13', title: 'Chapter 13', desc: 'Chapter 13 placeholder.' },
  { id: 'chapter-14', title: 'Chapter 14', desc: 'Chapter 14 placeholder.' },
  { id: 'chapter-15', title: 'Chapter 15', desc: 'Chapter 15 placeholder.' },
  { id: 'chapter-16', title: 'Chapter 16', desc: 'Chapter 16 placeholder.' },
  { id: 'chapter-17', title: 'Chapter 17', desc: 'Chapter 17 placeholder.' },
  { id: 'chapter-18', title: 'Chapter 18', desc: 'Chapter 18 placeholder.' },
  { id: 'chapter-19', title: 'Chapter 19', desc: 'Chapter 19 placeholder.' },
  { id: 'chapter-20-ending', title: 'Final Ending', desc: 'Ending wish and final credits.' }
];

const baseDir = path.join(__dirname, '..', 'chapters');

if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

chapters.forEach((ch) => {
  const chDir = path.join(baseDir, ch.id);
  const subDirs = ['images', 'videos', 'audio', 'content'];
  
  subDirs.forEach((sub) => {
    const dirPath = path.join(chDir, sub);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    if (sub === 'content') {
      const dataContent = `export const chapterData = {
  id: "${ch.id}",
  title: "${ch.title}",
  description: "${ch.desc}",
};
`;
      fs.writeFileSync(path.join(dirPath, 'data.ts'), dataContent);
    } else {
      fs.writeFileSync(path.join(dirPath, '.gitkeep'), `# Place ${sub} for ${ch.id} here`);
    }
  });
});

console.log('Successfully initialized all 21 chapter directories and placeholders!');
