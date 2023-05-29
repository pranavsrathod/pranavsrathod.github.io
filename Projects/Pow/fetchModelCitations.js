// Function to parse the CSV file
function parseCSV(csv) {
    const lines = csv.split("\n");
    const headers = lines[0].split(",");
    const citations = [];
  
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      const citation = {};
  
      for (let j = 0; j < headers.length; j++) {
        citation[headers[j]] = values[j];
      }
  
      citations.push(citation);
    }
  
    return citations;
  }
  
  // Function to generate HTML for the citation list
  function generateCitationList(citations) {
    const citationList = document.getElementById("citation-list");
  
    citations.forEach((citation) => {
      const li = document.createElement("li");
      const title = document.createElement("strong");
      title.innerHTML = `
      ${citation.Name} (<a href="${citation.Link}">source</a>) by ${citation.By} licensed under Creative Commons Attribution (<a href="http://creativecommons.org/licenses/by/4.0/">source</a>).
      `;
  
      const details = document.createElement("ul");
      details.innerHTML = `
        <li>Interactiveness: ${citation.Interactiveness}</li>
        <li>Sound: ${citation.Sound}</li>
        <li>Animation: ${citation.Animation}</li>
      `;
  
      li.appendChild(title);
      li.appendChild(details);
      citationList.appendChild(li);
    });
  }
  
  // Read the CSV file
  const file = "citations.csv";
  const xhr = new XMLHttpRequest();
  xhr.open("GET", file, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const csvData = xhr.responseText;
      const citations = parseCSV(csvData);
      generateCitationList(citations);
    }
  };
  xhr.send();
