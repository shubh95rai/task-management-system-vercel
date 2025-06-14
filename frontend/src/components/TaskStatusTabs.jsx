export default function TaskStatusTabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="my-2">
      <div className="flex flex-wrap justify-center sm:justify-start">
        {tabs.map((tab) => {
          if (tab.count === 0) {
            return null;
          }

          return (
            <button
              key={tab.label}
              className={`${
                tab.label === activeTab
                  ? " text-primary"
                  : "text-gray-500 hover:text-gray-700"
              } relative px-3 sm:px-4 py-2 text-xs md:text-sm  font-medium cursor-pointer`}
              onClick={() => setActiveTab(tab.label)}
            >
              <div className="flex items-center">
                <span>{tab.label}</span>
                <span
                  className={`text-xs ml-2 px-2 py-0.5 rounded-full ${
                    tab.label === activeTab
                      ? "bg-primary text-white"
                      : "bg-gray-200/70 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              </div>
              {tab.label === activeTab && (
                <div className="absolute left-0 bottom-0 w-full h-0.5 bg-primary"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
