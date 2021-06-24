/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import FormInput from './FormInput';
import SheetButton from './SheetButton';

// This is a wrapper for google.script.run that lets us use promises.
import server from '../../utils/server';

const { serverFunctions } = server;

// eslint-disable-next-line no-unused-vars
function doTheThings(data) {
  console.log(data);
}

// // eslint-disable-next-line no-unused-vars
// const doTheThings2 = data => {
//   setNames(data);
// }

const SheetEditor = () => {
  const [names, setNames] = useState([]);

  useEffect(() => {
    // Call a server global function here and handle the response with .then() and .catch()
    serverFunctions
      .getSheetsData()
      .then(data => {
        setNames(data);
        console.log('MAGIC 2');
        console.log('data', data);
        console.log('serverFunctions', serverFunctions);
      })
      .catch(alert);
  }, []);

  useEffect(() => {
    // Call a server global function here and handle the response with .then() and .catch()
    serverFunctions
      .getSheetValues()
      .then(data => {
        // setNames(data);
        console.log('awwwwww yeahhhhhhhhh');
        console.log('Sheet Values!', data);
        // console.log('serverFunctions', serverFunctions);
      })
      .catch(alert);
  }, []);

  const deleteSheet = sheetIndex => {
    serverFunctions
      .deleteSheet(sheetIndex)
      .then(data => {
        setNames(data);
        console.log('MAGIC 1');
      })
      .catch(alert);
  };

  const setActiveSheet = sheetName => {
    serverFunctions
      .setActiveSheet(sheetName)
      .then(data => {
        setNames(data);
        console.log('MAGIC');
      })
      .catch(alert);
  };

  // You can also use async/await notation for server calls with our server wrapper.
  // (This does the same thing as .then().catch() in the above handlers.)
  const submitNewSheet = async newSheetName => {
    try {
      const response = await serverFunctions.addSheet(newSheetName);
      setNames(response);
      console.log('MAGIC 3');
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(error);
    }
  };

  return (
    <div>
      <p>
        <b>☀️ React demo! HEYO ☀️</b>
      </p>
      <p>
        This is a sample page that demonstrates a simple React app. Enter a name
        for a new sheet, hit enter and the new sheet will be created. Click the
        red &times; next to the sheet name to delete it.
      </p>
      <FormInput submitNewSheet={submitNewSheet} />
      <TransitionGroup className="sheet-list">
        {names.length > 0 &&
          names.map(name => (
            <CSSTransition
              classNames="sheetNames"
              timeout={500}
              key={name.name}
            >
              <SheetButton
                sheetDetails={name}
                deleteSheet={deleteSheet}
                setActiveSheet={setActiveSheet}
              />
            </CSSTransition>
          ))}
      </TransitionGroup>
    </div>
  );
};

export default SheetEditor;
