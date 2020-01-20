import React, { useState } from 'react';
import Logger from 'js-logger';
import { makeStyles } from '@material-ui/core/styles';
import { CssBaseline, TextField, Grid, Card, CardContent, Button, Typography, MenuItem } from '@material-ui/core';
import {
  getClientByName, getProject, clientUpdateRequest, projectUpdateRequest,
  getFolder, getTestcase, getTestsuit
} from '../scripting/action';
import { login } from './action';
import { loginValidate } from './validate';
import { resCode } from '../../config/config';
import { useStore } from '../../hook-store/store';

const classes = makeStyles(theme => ({
  root: {
    height: '100vh',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(1, 0, 2),
    backgroundColor: 'lightgrey'
  },
  overlay: {
    position: 'absolute',
    top: '25%',
    bottom: '35%',
    right: '40%',
    left: '40%',
    backgroundColor: '#fff',
  },
  card: {
    minWidth: 275,
  },
  textField: {
    width: 240,
    marginTop: '10px !important',
  },
  menu: {
    width: 200,
  },
  text: {
    textAlign: 'center',
    fontSize: 30,
    fontFamily: 'auto'
  }
}));


function SignIn() {

  const gstate = useStore()[0];

  const [state, setState] = useState({
    username: "ssss",
    password: "ssss",
    message: null,

    gClients: [],
    gProjects: [],
    role: null,
    client: "Select Client",
    project: "Select Project",

    loginSatus: null,
    errors: {},
  })

  const handleDropdownChange = async (event) => {
    try {
      let { gClients, gProjects, gProject } = state;
      const _state = state;
      _state[event.target.name] = event.target.value;
      if (event.target.name === 'client') {
        let model = { client: event.target.value };

        gClients.map(async (data, i) => {
          if (data.name === event.target.value) {
            await clientUpdateRequest(data);
          }
        });

        let response = await getProject(model);
        gProjects = await response.result.map((data, i) => {
          return { ...data, key: data._id, label: data.name, value: data.name }
        });

      } else if (event.target.name === 'project') {
        gProjects.map(async (data, i) => {
          if (data.name === event.target.value) {
            gProject = data;
            await projectUpdateRequest(data);
          }
        });
      }
      setState({ gProjects, gProject, state: _state });
    } catch (e) {
      Logger.debug(e);
    }
  }

  const handleSubmit = async () => {
    try {
      let { gmodel } = state;
      let { username, password } = gmodel;
      let model = { username, password };
      handleLogin(model);
    } catch (e) {
      Logger.debug(e);
    }
  }

  const setProject = async (gProjects, responseClient) => {
    try {
      let pmodel = { client: responseClient.result[0].name };
      let responseProject = await getProject(pmodel);
      if (responseProject.status !== resCode.success) {
        setState({ message: responseProject.result });
        return;
      } else {
        gProjects = await responseProject.result.map((data, i) => {
          return { ...data, key: data._id, label: data.name, value: data.name }
        });
      }

      setState({ gProjects })
    } catch (e) {

    }
  }

  const handleLogin = async (model) => {
    try {
      let { gClients, gProjects } = state;
      let status = loginValidate(model);
      if (status !== undefined && status.errorFound === false) {
        let response = await login(model);
        if (response.status !== resCode.success) {
          setState({ message: "Invalid Login credentials !" });
          return;
        } else {
          setState({ message: null });
          let { clientName, role } = response.result;
          let model = { name: clientName };

          if (role === "tester") {
            let responseClient = await getClientByName(model);
            if (responseClient.status !== resCode.success) {
              setState({ message: responseClient.result });
            } else {
              gClients = await responseClient.result.map((data, i) => {
                return { ...data, key: data._id, label: data.name, value: data.name }
              });
              if (responseClient.result.length === 1) {
                await setProject(gProjects, responseClient);
              }
            }
            setState({ gClients, role: role, loginSatus: 'successful' });

          } else if (role === 'customer') {
            let responseClient = await getClientByName(model);
            if (responseClient.status !== resCode.success) {
              setState({ message: responseClient.result });
            } else {
              await clientUpdateRequest(responseClient.result[0]);
            }
            await setProject(gProjects, responseClient);
            setState({ client: clientName, role: role, loginSatus: 'successful' });
          }
        }
      } else {
        // handleErrors(status.errors);
      }
    } catch (e) {
      Logger.debug(e);
    }
  }

  const handleSwitch = async () => {
    try {
      let { gProject, client, project } = state;
      if (client && client !== "Select Client" && project && project !== "Select Project") {
        await handleFetchFolders(gProject);
        await handleFetchTestcase(gProject);
        await handleFetchTestsuit(gProject);
        // await history.push('/scripting');
      } else {
        setState({ message: "Please Select Above !" })
      }

    } catch (e) {
      console.log(e)
    }
  }

  const handleFetchFolders = async (data) => {
    try {
      let _modal = { project: data._id };
      await getFolder(_modal)
    } catch (e) {
      Logger.debug(e);
    }
  }


  const handleFetchTestcase = async (data) => {
    try {
      let _modal = { project: data._id };
      await getTestcase(_modal);
    } catch (e) {
      Logger.debug(e);
    }
  }


  const handleFetchTestsuit = async (data) => {
    try {
      let _modal = { project: data._id };
      await getTestsuit(_modal)
    } catch (e) {
      Logger.debug(e);
    }
  }



  let { loginSatus, gClients, gProjects, client, project, role, username, password, errors, message } = state;

  message = (message) ? message : "";
  return (
    <Grid className={classes.root} >
      <CssBaseline />
      <img className="signin" alt="" src={require("../../icon/signin.jpg")} />
      <Card className={classes.overlay}>
        {(!loginSatus) ? < CardContent >
          <Typography style={{ textAlign: 'center' }} gutterBottom variant="h5" component="h2">
            SIGN IN
          </Typography>
          <TextField
            id="username"
            fullWidth
            label="Username"
            name="username"
            autoFocus
            value={username}
            // onChange={handleChange}
            error={errors.username}
          />
          <TextField
            id="password"
            style={{ marginTop: 10 }}
            fullWidth
            name="password"
            label="Password"
            type="password"
            value={password}
            // onChange={handleChange}
            error={errors.password}
          />
          <p style={{ paddingTop: '5%', marginBottom: 0, textAlign: 'center', color: 'red', fontSize: '18' }}>{message}</p>
          <Button fullWidth id="signin" color="primary" className={classes.submit} onClick={handleSubmit}  >
            Sign In
            </Button>
        </CardContent> :
          <CardContent >
            <Typography style={{ textAlign: 'center' }} gutterBottom variant="h5" component="h2">
              Select Project
          </Typography>
            {(!role || role === "tester") ? <TextField
              id="selectclient"
              name="client"
              select
              label="Select A Client"
              style={{ textAlign: 'left' }}
              className={classes.textField}
              value={client}
              // onChange={handleDropdownChange}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              margin="normal"
            >
              {gClients.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField> :
              <Typography className={classes.text} variant="h5" gutterBottom>
                {client}
              </Typography>}
            <TextField
              id="selectproject"
              name="project"
              select
              label="Select A Project"
              style={{ textAlign: 'left' }}
              className={classes.textField}
              value={project}
              // onChange={handleDropdownChange}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              margin="normal"
            >
              {gProjects.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <p style={{ paddingTop: '5%', marginBottom: 0, textAlign: 'center', color: 'red', fontSize: '18' }}>{message}</p>
            <Button id="ok" fullWidth color="primary" className={classes.submit} onClick={handleSwitch}  >
              OK
            </Button>
          </CardContent>
        }
      </Card>
    </Grid >
  );
}

export default SignIn;
