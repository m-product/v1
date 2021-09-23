import { useEffect, useState } from "react";

export default function LaunchPage() {
  const [groups, setGroups] = useState({});

  const updateUsers = () => {
    fetch(
      "https://sheets.googleapis.com/v4/spreadsheets/1WZyBptZn61w-M8uEDh-Wtd2UFrlFW2S2edbIYzGKuVE?key=AIzaSyDv3I0LTp0DCL6ruLKpU3VIkG5O0C-Y_Hw&includeGridData=true"
    )
      .then((res) => res.json())
      .then((json) => {
        setTimeout(updateUsers, 2500);
        if (!json?.sheets) return;
        const data = json.sheets[0]?.data;
        if (!data?.length) return;
        const rows = data[0]?.rowData;
        let groupsNew = {};
        rows.forEach((row, index) => {
          if (index == 0) return;
          const values = row.values;
          let name = values[1]?.effectiveValue?.stringValue;
          const group = values[4]?.effectiveValue?.numberValue;
          if (!name?.length || group === undefined) return;
          const nameSplit = name.split(" ");
          if (nameSplit.length > 1 && nameSplit[1].length)
            name = nameSplit[0] + " " + nameSplit[1][0] + ".";
          if (groupsNew[group]) {
            groupsNew[group].push(name);
          } else {
            groupsNew[group] = [name];
          }
        });
        console.log(groupsNew);
        setGroups(groupsNew);
      });
  };

  useEffect(() => {
    updateUsers();
  }, []);

  const groupNames = [
    "💎", //0
    "🚀", //1
    "🌈", //2
    "🦌", //3
    "🚨", //4
    "🤡", //5
    "🎀", //6
    "🍟", //7
    "🥞", //8
    "🏮", //9
  ];

  const positions = [
    { top: "6%", left: "21%" },
    { bottom: "3%", right: "22%" },
    { top: "14%", left: "0.5%" },
    { bottom: "17%", right: "2%" },
    { top: "10%", left: "42%" },
    { bottom: "0.5%", left: "0.5%" },
    { top: "1%", right: "0.5%" },
    { bottom: "6%", left: "37%" },
    { top: "23%", right: "18%" },
    { bottom: "22%", left: "18%" },
  ];

  const bubbleWidth = 20;
  const bubbleHeight = (bubbleWidth * 16) / 9;

  return (
    <main>
      <div className="h-screen bg-gradient-to-r from-gray-900 to-black flex">
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "39%",
            backgroundColor: "white",
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
          }}
          className="flex flex-col justify-center text-center p-2"
        >
          <h1 className="text-2xl text-blue-800 font-medium leading-none tracking-wider mb-1">
            {"GO TO"}
          </h1>
          <h1 className="text-2xl text-blue-900 font-bold leading-none tracking-wider">
            {"LAUNCH.V1MICHIGAN.COM"}
          </h1>
        </div>
        <div className="m-auto">
          <div className="items-center flex flex-row w-auto ml-16 mt-6">
            <img
              src="/V1Logo.png"
              width="58px"
              height="auto"
              className="mr-2"
            />
            <h1 className="text-10xl tracking-tight font-bold text-blue-100 leading-none mr-4">
              {"V1"}
            </h1>
          </div>
        </div>
      </div>
      {Object.keys(groups).map((group, index) => (
        <div
          style={{
            backgroundColor: "#FFFFFFCC",
            borderRadius: "100%",
            position: "absolute",
            ...positions[index],
            padding: 8,
            height: bubbleHeight.toString() + "%",
            width: bubbleWidth.toString() + "%",
            aspectRatio: 1.0,
            // width: bubbleSize,
            // height: bubbleSize,
            // alignItems: "center",
            // justifyContent: "center",
          }}
        >
          <div className="flex flex-col justify-center transition-all">
            <h1 className="text-6xl m-auto">{groupNames[index]}</h1>
            <div className="flex flex-row mx-auto">
              <div className="mr-3">
                {groups[group]
                  .slice(0, groups[group].length / 2)
                  .map((name, nameI) => (
                    <h1
                      className={`text-1xl text-blue-900 font-medium leading-none tracking-wider my-1 text-center`}
                    >
                      {name}
                    </h1>
                  ))}
              </div>
              <div>
                {groups[group].slice(groups[group].length / 2).map((name) => (
                  <h1 className="text-1xl text-blue-900 font-medium leading-none tracking-wider my-1 text-center">
                    {name}
                  </h1>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}
