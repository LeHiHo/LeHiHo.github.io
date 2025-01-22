import React, { useState, useEffect } from "react";

function App() {
  const [dates, setDates] = useState([]);
  const [counts, setCounts] = useState([]);

  useEffect(() => {
    fetch("/testInfo.json")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load JSON");
        return response.json();
      })
      .then((data) => {
        setDates(data.dates);
        setCounts(Array(data.dates.length).fill(0)); // counts 초기화
      })
      .catch((error) => console.error("Error loading JSON:", error));
  }, []);

  const updateCount = (index, delta) => {
    setCounts((prev) =>
      prev.map((count, i) => (i === index ? Math.max(0, count + delta) : count))
    );
  };

  const groupedDates = dates.reduce((acc, date, index) => {
    const year = date.split("-")[0];
    acc[year] = acc[year] || [];
    acc[year].push({ date, index });
    return acc;
  }, {});

  const sortedYears = Object.keys(groupedDates).sort((a, b) => b - a);

  sortedYears.forEach((year) =>
    groupedDates[year].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">
          Test Review Tracker
        </h1>
        {sortedYears.map((year) => (
          <div key={year} className="mb-10">
            <h2 className="text-3xl font-semibold text-gray-700 border-b-2 border-gray-300 pb-2 mb-4">
              {year}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {groupedDates[year].map(({ date, index }) => (
                <div
                  key={date}
                  className="bg-gradient-to-br from-blue-100 via-white to-blue-50 p-6 shadow-md rounded-lg transform hover:scale-105 transition-transform duration-300"
                >
                  <div className="text-xl font-bold text-gray-800 mb-4 text-center">
                    {date}
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
                      onClick={() => updateCount(index, -1)}
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold text-gray-800">
                      {counts[index]}
                    </span>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
                      onClick={() => updateCount(index, 1)}
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
    </div>
  );
}

export default App;
