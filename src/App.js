import React from 'react';
import './App.css';
import MaterialTable from 'material-table';

function App() {

  let insert = (newPerson) => {
    let url = "http://localhost:8000/api/title";
    let params = {
      title: newPerson.title || ""
    };

    return fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        if (json.error) {
        } else {
          console.log("response", json);
        }
        return json;
      })
      .catch((error) => {
        return error;
      });
  };
  const remove = (id) => {
    let url = "http://localhost:8000/api/titles/"+id;
    return fetch(url, {
      method: 'DELETE',
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        if (json.error) {
        } else {
          console.log("response", json);
        }
        return json;
      })
      .catch((error) => {
        return error;
      });
  };
  const edit = (newData) => {
    let url = "http://localhost:8000/api/titles/"+newData.id;
    let params = newData;

    return fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        if (json.error) {
        } else {
          console.log("response", json);
        }
        return json;
      })
      .catch((error) => {
        return error;
      });
  };

  return (
    <div className="App">
      <header className="App-header">
      Table Component
      </header>
      <h3>Server side pagination in React Material Table with CRUD</h3>
     <div className="Table">
       <MaterialTable
      title="Remote Data Preview"
      columns={[
        
        { title: 'Id', field: 'id',editable: 'never' },
        { title: 'Title', field: 'title', validate: rowData => rowData.title === '' ? 'title is required' : '' },
        { title: 'Date', field: 'updated_at',editable: 'never' },
      ]}
      editable={{
        onRowAdd: newData =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
            insert(newData);
            console.log("new data", newData); 
              resolve();
            }, 1000)
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
          edit(newData);
          console.log("old", oldData);
          console.log("new", newData);
              resolve();
            }, 1000)
          }),
        onRowDelete: oldData =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
          console.log("id", oldData.id);
          remove(oldData.id);  
              resolve()
            }, 1000)
          }),
      }}
      options={{
        sorting: true,
        search: false,
        filtering: true,
        selection: true,
        actionsColumnIndex: -1, // action icons on the right
        padding: 'dense', // small table row
        debounceInterval: 800, // delay on column search
        headerStyle: {
          backgroundColor: 'transparent',
          fontWeight: 'bold',
        }
      }}
      actions={[
        {
          tooltip: 'Remove All Selected Records',
          icon: 'delete',
          onClick: (evt, data) => alert('You want to delete ' + data.length + ' rows')
        }
      ]}
      data={query =>
        new Promise((resolve, reject) => {
          let url = 'http://localhost:8000/api/titles';
          // create json object from filters array to send to web API
          let i;
          let filtersArray = [];
          if(query.filters.length >0){
         
          for(i=0;i<query.filters.length;i++){
            filtersArray.push({'field': query.filters[i].column.field,'value': query.filters[i].value});
          }
          console.log("NEW ARRAY:",filtersArray);
        }
          let sortBy = '';
          let orderDirection = '';
          if(query.orderBy !== undefined){
            sortBy = query.orderBy.field;
            orderDirection = query.orderDirection;
            } 
          let params = {
            per_page: query.pageSize,
            sortBy: sortBy,
            orderDirection: orderDirection,
            page: query.page + 1,
            filters: filtersArray
          }
          fetch(url, {
            method:  'POST',
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params)
        })
            .then(response => response.json())
            .then(result => {
              console.log('query+++',query);
              resolve({
                data: result.data,
                page: result.current_page - 1,
                totalCount: result.total,
              })
            })
        })
      }
    />
    </div>
    </div>
  );
}

export default App;
