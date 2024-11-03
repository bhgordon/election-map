"use client";

import { useState, useEffect } from "react";

interface StateData {
  name: string;
  abbreviation: string;
  electoralVotes: number;
  likelyOutcome: "Democrat" | "Republican" | "Toss-Up";
  likelihood: "strong" | "lean" | "unknown";
}

function ScenarioBuilder() {
  const [stateData, setStateData] = useState<StateData[]>([]);
  const [demVoteTotal, setDemVoteTotal] = useState<number>(0);
  const [repVoteTotal, setRepVoteTotal] = useState<number>(0);
  const [tossUpVoteTotal, setTossUpVoteTotal] = useState<number>(0);

  // Fetching from local json file (need to but this in a context at some point)
  useEffect(() => {
    fetch("/usStates.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data: StateData[]) => {
        setStateData(data);
        calculateVoteTotals(data); // Initialize vote totals based on fetched data
      })
      .catch((error) =>
        console.error(
          "There has been a problem with your fetch operation",
          error
        )
      );
  }, []);

  const handleOnClick = (clickedState: StateData) => {
    setStateData((prevStateData) => {
      // Map through the array and update the clicked state’s likelyOutcome
      const updatedStateData = prevStateData.map((state) => {
        if (state.name === clickedState.name) {
          // Cycle through likelyOutcome values
          const newLikelyOutcome: StateData["likelyOutcome"] =
            state.likelyOutcome === "Democrat"
              ? "Republican"
              : state.likelyOutcome === "Republican"
              ? "Toss-Up"
              : "Democrat";

          return { ...state, likelyOutcome: newLikelyOutcome };
        }
        return state;
      });

      // Find the updated state and filter it out from the rest
      const clickedAndUpdatedState = updatedStateData.find(
        (state) => state.name === clickedState.name
      );
      const remainingStates = updatedStateData.filter(
        (state) => state.name !== clickedState.name
      );

      // Place the clicked and updated state at the front
      return clickedAndUpdatedState
        ? [clickedAndUpdatedState, ...remainingStates]
        : prevStateData;
    });
  };

  // Recalculate vote totals whenever `stateData` changes
  useEffect(() => {
    calculateVoteTotals(stateData);
  }, [stateData]);

  const calculateVoteTotals = (states: StateData[]) => {
    let demTotal = 0;
    let repTotal = 0;
    let tossUpTotal = 0;

    states.forEach((state) => {
      if (state.likelyOutcome === "Democrat") {
        demTotal += state.electoralVotes;
      } else if (state.likelyOutcome === "Republican") {
        repTotal += state.electoralVotes;
      } else {
        tossUpTotal += state.electoralVotes;
      }
    });

    setDemVoteTotal(demTotal);
    setRepVoteTotal(repTotal);
    setTossUpVoteTotal(tossUpTotal);
  };

  const democratStates = stateData.filter(
    (state) => state.likelyOutcome === "Democrat"
  );
  const republicanStates = stateData.filter(
    (state) => state.likelyOutcome === "Republican"
  );
  const tossUpStates = stateData.filter(
    (state) => state.likelyOutcome === "Toss-Up"
  );

  const getColorClass = (likelihood: string) => {
    switch (likelihood) {
      case "strong":
        return "800";
      case "lean":
        return "500";
      case "unknown":
        return "500 border-2 bg-opacity-50";
      default:
        return "800";
    }
  };

  console.log(tossUpStates);

  return (
    <div className="justify-items-center min-h-screen mx-8">
      <div className="p-4 mb-5 w-1/2">
        <div className="py-3 rounded mb-4">
          <h1 className="font-bold text-5xl">Scenario builder</h1>
        </div>
        <div className="flex justify-between">
          <p className="px-4 py-3 bg-blue-800 rounded">
            Democrat Votes: {demVoteTotal}
          </p>
          <p className="px-4 py-3 bg-zinc-500 rounded">
            Toss-up Votes: {tossUpVoteTotal}
          </p>
          <p className="px-4 py-3 bg-red-800 rounded">
            Republican Votes: {repVoteTotal}
          </p>
        </div>
      </div>

      <div className="flex justify-center mx-auto gap-4 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-w-1/4 h-fit">
          {democratStates.map((state, index) => {
            return (
              <button
                onClick={() => handleOnClick(state)}
                className={`flex flex-col items-center justify-center p-4 rounded bg-blue-${getColorClass(
                  state.likelihood
                )}`}
                key={index}
              >
                <p>{state.name}</p>
                <p className="font-bold">{state.electoralVotes}</p>
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-w-1/4 h-fit">
          {tossUpStates.map((state, index) => {
            return (
              <button
                onClick={() => handleOnClick(state)}
                className={`p-4 flex flex-col items-center justify-center rounded bg-purple-${getColorClass(
                  state.likelihood
                )}`}
                key={index}
              >
                <p>{state.name}</p>
                <p className="font-bold">{state.electoralVotes}</p>
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-w-1/4 h-fit">
          {republicanStates.map((state, index) => {
            return (
              <button
                onClick={() => handleOnClick(state)}
                className={`p-4 flex flex-col items-center justify-center rounded bg-red-${getColorClass(
                  state.likelihood
                )}`}
                key={index}
              >
                <p>{state.name}</p>
                <p className="font-bold">{state.electoralVotes}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ScenarioBuilder;
