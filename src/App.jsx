import React, { useState, useEffect } from "react";

function App() {
  const [dates, setDates] = useState([]);

  // JSON 파일 로드
  useEffect(() => {
    fetch("/testInfo.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load JSON");
        }
        return response.json();
      })
      .then((data) => setDates(data.dates))
      .catch((error) => console.error("Error loading JSON:", error));
  }, []);

  const [counts, setCounts] = useState([]);

  // 날짜가 로드되면 counts 초기화
  useEffect(() => {
    if (dates.length > 0) {
      setCounts(Array(dates.length).fill(0));
    }
  }, [dates]);

  const handleIncrement = (index) => {
    const newCounts = [...counts];
    newCounts[index] += 1;
    setCounts(newCounts);
  };

  const handleDecrement = (index) => {
    const newCounts = [...counts];
    if (newCounts[index] > 0) {
      newCounts[index] -= 1;
    }
    setCounts(newCounts);
  };

  const groupedDates = dates.reduce((acc, date, index) => {
    const year = `${date.split("-")[0]}`;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push({ date, index });
    return acc;
  }, {});

  // 년도를 내림차순으로 정렬
  const sortedYears = Object.keys(groupedDates).sort((a, b) => b - a);

  // 각 년도의 날짜 배열을 빠른 월부터 정렬 (오름차순)
  sortedYears.forEach((year) => {
    groupedDates[year].sort(
      (a, b) =>
        new Date(`${a.date}`).getTime() - new Date(`${b.date}`).getTime()
    );
  });

  return (
    <div className="p-4">
      {sortedYears.map((year) => (
        <div key={year} className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{year}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {groupedDates[year].map(({ date, index }) => (
              <div
                key={date}
                className="bg-gray-200 p-4 text-center border border-gray-300 rounded font-mono flex justify-between items-center"
              >
                <div className="text-2xl font-bold">{date}</div>
                <div className="flex items-center">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => handleDecrement(index)}
                  >
                    -
                  </button>
                  <span className="text-xl">{counts[index]}</span>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded ml-2"
                    onClick={() => handleIncrement(index)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
