import {EMPLOYEE_UPDATE,EMPLOYEE_CREATE,EMPLOYEE_FETCH_SUCCESS,EMPLOYEE_SAVE_SUCCESS} from './types';
import firebase from 'firebase';
import {Actions} from 'react-native-router-flux';

export const employeeUpdate = ({prop,value}) =>{
    console.log('here');
  return {
      type:EMPLOYEE_UPDATE,
      payload:{prop,value}
  }
};

export const employeeCreate = ({name,phone,shift}) => {
    return(dispatch) => {
        const {currentUser}=firebase.auth();
        firebase.database().ref(`/users/${currentUser.uid}/employees`)
            .push({name, phone, shift})
            .then(()=>{
                dispatch({type:EMPLOYEE_CREATE});
                Actions.employeeList({type:'reset'})
                }
            );
    }


};


export const employeeFetch = () => {
  return(dispatch) => {
      const {currentUser}=firebase.auth();
      firebase.database().ref(`/users/${currentUser.uid}/employees`)
          .on('value',snapshot => {
              dispatch({type:EMPLOYEE_FETCH_SUCCESS,payload:snapshot.val()})
          } )
  }
};

export const employeeSave = ({ name, phone, shift, uid }) => {
    const { currentUser } = firebase.auth();

    return (dispatch) => {
        firebase.database().ref(`/users/${currentUser.uid}/employees/${uid}`)
            .set({ name, phone, shift })
            .then(() => {
                dispatch({ type: EMPLOYEE_SAVE_SUCCESS });
                Actions.employeeList({ type: 'reset' });
            });
    };
};

export const employeeDelete = ({ uid }) => {
    const { currentUser } = firebase.auth();

    return () => {
        firebase.database().ref(`/users/${currentUser.uid}/employees/${uid}`)
            .remove()
            .then(() => {
                Actions.employeeList({ type: 'reset' });
            });
    };
};
