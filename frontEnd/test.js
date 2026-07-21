const fs = require('fs');
fetch('http://127.0.0.1:8000/api/reports?type=all')
  .then(r => r.json())
  .then(data => {
      const reports = data.data;
      const names = new Set(reports.map(r => r.name));
      console.log('Unique names:', Array.from(names));
      const grouped = {};
      reports.forEach(report => {
        let personName = report.name || 'عام';
        personName = personName.replace(/^خروج - /, '').replace(/^دخول - /, '').trim();
        if(!grouped[personName]) grouped[personName] = 0;
        grouped[personName]++;
      });
      console.log('Grouped names:', Object.keys(grouped));
  }).catch(e => console.error(e));
