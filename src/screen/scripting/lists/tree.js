import React, { Component } from 'react';
import { connect } from 'react-redux';
import TreeView from 'react-treeview';
import { Tooltip } from '@material-ui/core';
import { treeUpdateRequest } from '../action';
import {
  Delete as DeleteIcon, Redo as RedoIcon, NoteAdd as NoteAddIcon,
  Edit as EditIcon, FileCopy as FileCopyIcon, CreateNewFolder as CreateNewFolderIcon
} from '@material-ui/icons';

class TestcaseTree extends Component {

  constructor(props) {
    super(props);
    this.state = {
      Folders: [],
      Testcases: [],
      searchTest: '',
      gRefreshTree: "gRefreshKey" + Math.random(),
      selectItem: '',
      seletedFolder: '',
      seletedTestcase: '',
    };
  }

  UNSAFE_componentWillReceiveProps() {
    this.handleComponentWillRecieverProps();
  }

  handleComponentWillRecieverProps = async () => {
    try {
      let { testcase, updateTree } = this.props.gStore;
      if (updateTree === false) {
        this.setState({ selectItem: "" });
        return;
      }
      await this.initRefreshTree();
      this.setState({ selectItem: testcase, gRefreshTree: "gRefreshTree" + Math.round() });
      await this.props.treeUpdateRequest();
    } catch (e) {
      console.log(e)
    }
  }

  componentWillMount() {
    this.handleComponentWillMount();
  }

  handleComponentWillMount = async () => {
    try {
      await this.initTree();
    } catch (e) {
      console.log(e)
    }
  }

  initRefreshTree = async () => {
    try {
      let { testcases, folders, folder, testcase } = this.props.gStore;

      let Folders = await folders.map((data) => {
        if (data._id === folder._id) {
          return { ...data, 'collapsed': false }
        } else {
          return { ...data, 'collapsed': true }
        }
      });

      let Testcases = await testcases.map((data) => {
        if (data._id === testcase._id) {
          return { ...data, 'collapsed': false }
        } else {
          return { ...data, 'collapsed': true }
        }
      });

      await this.setState({ Folders, Testcases });
    } catch (e) {
      console.log(e);
    }
  }

  initTree = async () => {
    try {
      let { gTestcases, gFolders } = this.props;
      let Folders = await gFolders.map((data) => { return { ...data, 'collapsed': true } });
      let Testcases = await gTestcases.map((data) => { return { ...data, 'collapsed': true } });
      this.setState({ Folders, Testcases });
    } catch (e) {
      console.log(e);
    }
  }

  handleChange = async (e) => {
    try {
      let { gTestcases, gFolders } = this.props;
      let tfilterInput = e.target.value;
      this.setState({ searchTest: tfilterInput });

      if (!tfilterInput) {
        this.initTree();
        return true;
      }

      tfilterInput = tfilterInput.toLowerCase();

      let filteredFolders = gFolders.filter((data) => {
        let { folder } = data;
        folder = (folder) ? folder.toLowerCase() : ""
        return (
          folder.indexOf(tfilterInput) >= 0
        );
      })

      this.setState({ Folders: filteredFolders });

    } catch (e) {

    }
  }

  handleHoverOnFolder = async (fold) => {
    try {
      this.setState({ selectItem: fold });
    } catch (e) {

    }
  }

  handleOnFolderClick = async (fold) => {
    try {
      this.props.handleFolderClick(fold);
      this.setState({ seletedFolder: fold });
    } catch (e) {

    }
  }

  handleHoverOnTestcase = async (testcase) => {
    try {
      this.setState({ selectItem: testcase });
    } catch (e) {

    }
  }

  handleOnTestcaseClick = async (testcase) => {
    try {
      this.props.handleTestcaseClick(testcase);
      this.setState({ seletedTestcase: testcase });
    } catch (e) {

    }
  }

  getTestcaseCount = (folder) => {
    let { Testcases } = this.state;
    return Testcases.filter(test => test.folder === folder._id).length;
  }

  getAllTestcaseCount = (folder) => {

    let testcase1, testcase2 = 0;

    let { Folders, Testcases } = this.state;
    testcase1 = Testcases.filter(test => test.folder === folder._id).length;


    let child = Folders.filter(fold => fold.parentFolder === folder._id);

    if (child && child.length > 0) {
      Testcases.map(test => {
        child.map((child) => {
          if (child._id === test.folder) {
            testcase2 = testcase2 + 1;
          }
        })
      });
    }

    return testcase1 + testcase2;

  }

  render() {
    let { selectItem, seletedTestcase, seletedFolder, gRefreshTree, Folders, Testcases, searchTest } = this.state;


    if (gRefreshTree) {

      if (Folders && Folders.length > 0) {
        return (
          <div>
            <input id="searchfolder" style={{
              textAlign: 'left', width: '-webkit-fill-available',
              backgroundColor: '#adb5ba', height: 24, marginTop: 5, marginBottom: 5,
            }} name="testcase" type="input" placeholder="Search Folder" value={searchTest} onChange={this.handleChange} />
            <div key={gRefreshTree}>

              {Folders.map((fold, i) => {
                let totalTestcase = this.getAllTestcaseCount(fold);

                let background = (fold._id === seletedFolder._id) ? "#7d7c79" : (fold._id === selectItem._id) ? '#a0a0a0' : "";
                let trimmedFold = (fold.folder.length > 40) ? fold.folder.substring(0, 40) + "..." : fold.folder;

                const label = <span className="folder" style={{ backgroundColor: background }}
                  onMouseOver={() => this.handleHoverOnFolder(fold)}
                  onClick={() => this.handleOnFolderClick(fold)} >{trimmedFold + " (" + totalTestcase + ")"}
                  {(selectItem._id === fold._id) ?
                    <Tooltip title="Delete" placement="top">
                      <DeleteIcon id="deletefolder" style={{ float: 'right', fontSize: 18, color: '#348216' }} onClick={() => this.props.handleDelete({ ...fold, model: 'folder' })} />
                    </Tooltip> : null}
                  {(selectItem._id === fold._id) ? <Tooltip title="Edit" placement="top">
                    <EditIcon id="editfolder" style={{ float: 'right', marginRight: 3, fontSize: 18, color: 'red' }} onClick={() => this.props.handleEditForm('gKeyFolderForm', "edit", fold)} />
                  </Tooltip> : null}
                  {(selectItem._id === fold._id) ? <Tooltip title="Create Folder" placement="top">
                    <CreateNewFolderIcon id="createfolder" style={{ float: 'right', marginRight: 3, fontSize: 18, color: '#f9de53' }} onClick={() => this.props.handleCreateForm('gKeyFolderForm', "child")} fontSize="small" />
                  </Tooltip> : null}
                  {(selectItem._id === fold._id) ? <Tooltip title="Create Testcase" placement="top">
                    <NoteAddIcon id="createtestcase" style={{ float: 'right', marginRight: 3, fontSize: 18, color: '#e3ecf1' }} onClick={() => this.props.handleCreateForm('gKeyTestcaseForm', "create")} />
                  </Tooltip> : null}
                  {/* {(selectItem._id === fold._id) ? <Tooltip title="Total Testcase" placement="top">
                    <p style={{ float: 'left', fontSize: 14, color: 'black', fontWeight: 700, marginBottom: 0, marginRight: 8 }}>{totalTestcase}</p>
                  </Tooltip> : null} */}
                </span>

                if (fold.parentFolder === 0) {
                  return (
                    <TreeView key={fold + '|' + i} nodeLabel={label} defaultCollapsed={fold.collapsed} >
                      {Folders.map((child, i) => {

                        let totalTestcase = this.getTestcaseCount(child);

                        let background = (child._id === seletedFolder._id) ? "#7d7c79" : (child._id === selectItem._id) ? '#a0a0a0' : "";
                        let trimmedChild = (child.folder.length > 50) ? child.folder.substring(0, 50) + "..." : child.folder;

                        const label2 = <span className="subfolder" style={{ backgroundColor: background }}
                          onMouseOver={() => this.handleHoverOnFolder(child)}
                          onClick={() => this.handleOnFolderClick(child)}>{trimmedChild + " (" + totalTestcase + ")"}
                          {(selectItem._id === child._id) ? <Tooltip title="Delete" placement="top">
                            <DeleteIcon id="deletesubfolder" style={{ float: 'right', fontSize: 18, color: '#348216' }} onClick={() => this.props.handleDelete({ ...child, model: 'folder' })} />
                          </Tooltip> : null}
                          {(selectItem._id === child._id) ? <Tooltip title="Edit" placement="top">
                            <EditIcon id="editsubfolder" style={{ float: 'right', marginRight: 5, fontSize: 18, color: 'red' }} onClick={() => this.props.handleEditForm('gKeyFolderForm', "edit", child)} />
                          </Tooltip> : null}
                          {(selectItem._id === child._id) ? <Tooltip title="Create Testcase" placement="top">
                            <NoteAddIcon id="addtestcaseinsubfolder" style={{ float: 'right', marginRight: 5, fontSize: 18, color: '#e3ecf1' }} onClick={() => this.props.handleCreateForm('gKeyTestcaseForm', "create")} />
                          </Tooltip> : null}
                          {/* {(selectItem._id === child._id) ? <Tooltip title="Total Testcase" placement="top">
                            <p style={{ float: 'right', fontSize: 14, color: 'black', fontWeight: 700, marginBottom: 0, marginRight: 8 }}>{totalTestcase}</p>
                          </Tooltip> : null} */}
                        </span>

                        if (fold._id === child.parentFolder) {
                          return (
                            <TreeView nodeLabel={label2} key={i} defaultCollapsed={child.collapsed}>
                              {Testcases.map((childTestcase, i) => {
                                let background = (childTestcase._id === seletedTestcase._id) ? "#7d7c79" : (childTestcase._id === selectItem._id) ? '#a0a0a0' : "";
                                let trimmedChildTestcase = (childTestcase.desc.length > 50) ? childTestcase.desc.substring(0, 50) + "..." : childTestcase.desc;

                                if (child._id === childTestcase.folder) {
                                  return (
                                    <div key={i} className="info" style={{ backgroundColor: background }}
                                      onMouseOver={() => this.handleHoverOnTestcase(childTestcase)}
                                      onClick={() => this.handleOnTestcaseClick(childTestcase)}
                                    >
                                      {trimmedChildTestcase}
                                      {(selectItem._id === childTestcase._id) ? <Tooltip title="Delete" placement="top">
                                        <DeleteIcon id="deletesubfoldertestcase" style={{ float: 'right', fontSize: 18, color: '#348216' }} onClick={() => this.props.handleDelete({ ...childTestcase, model: 'testcase' })} />
                                      </Tooltip> : null}
                                      {(selectItem._id === childTestcase._id) ? <Tooltip title="Edit" placement="top">
                                        <EditIcon id="editsubfoldertestcase" style={{ float: 'right', marginRight: 5, fontSize: 18, color: 'red' }} onClick={() => this.props.handleEditForm('gKeyTestcaseForm', "edit", childTestcase)} />
                                      </Tooltip> : null}
                                      {(selectItem._id === childTestcase._id) ? <Tooltip title="Copy Testcase" placement="top">
                                        <RedoIcon id="copytestcaseinsubfolder" style={{ float: 'right', marginRight: 5, fontSize: 18, color: '#696969' }} onClick={() => this.props.handleCopyTestcase(childTestcase)} />
                                      </Tooltip> : null}
                                      {(childTestcase.cloneof) ? null :
                                        (selectItem._id === childTestcase._id) ? <Tooltip title="Create Clone" placement="top">
                                          <FileCopyIcon id="createcloneinsubfolder" style={{ float: 'right', marginRight: 5, fontSize: 18, color: '#e3ecf1' }} onClick={() => this.props.handleEditForm("gKeyTestcaseForm", "clone", childTestcase)} />
                                        </Tooltip> : null}
                                    </div>
                                  );
                                }
                                return false;
                              })}
                            </TreeView>
                          )
                        }
                        return false;
                      })}
                      {Testcases.map((testcase, i) => {

                        let background = (testcase._id === seletedTestcase._id) ? "#7d7c79" : (testcase._id === selectItem._id) ? '#a0a0a0' : "";
                        let trimmedTestcase = (testcase.desc.length > 50) ? testcase.desc.substring(0, 50) + "..." : testcase.desc;

                        if (fold._id === testcase.folder) {
                          return (
                            <div key={i} className="info" style={{ backgroundColor: background }}
                              onMouseOver={() => this.handleHoverOnTestcase(testcase)}
                              onClick={() => this.handleOnTestcaseClick(testcase)}>
                              {trimmedTestcase}
                              {(selectItem._id === testcase._id) ? <Tooltip title="Delete" placement="top">
                                <DeleteIcon id="deletefoldertestcase" style={{ float: 'right', fontSize: 18, color: '#348216' }} onClick={() => this.props.handleDelete({ ...testcase, model: 'testcase' })} />
                              </Tooltip> : null}
                              {(selectItem._id === testcase._id) ? <Tooltip title="Edit" placement="top">
                                <EditIcon id="editfoldertestcase" style={{ float: 'right', marginRight: 5, fontSize: 18, color: 'red' }} onClick={() => this.props.handleEditForm('gKeyTestcaseForm', "edit", testcase)} />
                              </Tooltip> : null}
                              {(selectItem._id === testcase._id) ? <Tooltip title="Copy Testcase" placement="top">
                                <RedoIcon id="copytestcaseinfolder" style={{ float: 'right', marginRight: 5, fontSize: 18, color: '#696969' }} onClick={() => this.props.handleCopyTestcase(testcase)} />
                              </Tooltip> : null}
                              {(testcase.cloneof) ? null :
                                (selectItem._id === testcase._id) ? <Tooltip title="Create Clone" placement="top">
                                  <FileCopyIcon id="createcloneinfolder" style={{ float: 'right', marginRight: 5, fontSize: 18, color: '#e3ecf1' }} onClick={() => this.props.handleEditForm("gKeyTestcaseForm", "clone", testcase)} />
                                </Tooltip> : null}
                            </div>
                          );
                        }
                        return false;
                      })}
                    </TreeView>
                  );
                }
                return false;
              })
              }
            </div>
          </div>
        )
      }
      return false
    }
  }
}

const mapStateToProps = ({ ScriptingReducer }) => {
  const gStore = ScriptingReducer;
  return { gStore };
}

export default connect(mapStateToProps, { treeUpdateRequest })(TestcaseTree);
