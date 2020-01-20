import React, { Component } from 'react';
import { connect } from 'react-redux';
import Logger from 'js-logger';

import { IconButton } from '@material-ui/core';
import { Delete, Send } from '@material-ui/icons';

import ReactDataGrid from 'react-data-grid';
import "bootstrap/dist/css/bootstrap.css";
import { ActionListType, LocatorListType } from '../../../config/config';

import { DeleteModal } from "./index";
import { getTime } from '../../../utils/helper';

const {
    Draggable: {
        Container: DraggableContainer,
        RowActionsCell,
        DropTargetRowContainer
    },
    Data: { Selectors },
    Editors
} = require("react-data-grid-addons");
const RowRenderer = DropTargetRowContainer(ReactDataGrid.Row);

const { DropDownEditor } = Editors;

const TableActionListTypeEditor = <DropDownEditor options={ActionListType} />;
const TableLocatorListTypeEditor = <DropDownEditor options={LocatorListType} />;

Logger.useDefaults();

class StepReactGrid extends Component {
    static defaultProps = { rowKey: "id" };
    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            nonEditableColumn: [],

            rows: [],
            selectedIds: [],
            filters: {},

            allDataset: [],
            booleanDataset: [],

            deleteObject: {},
            gKeyDelete: null,
        };
    }

    refreshComponent = async (key) => this.setState({ [key]: key + Math.random() });
    resetComponent = async (key) => this.setState({ [key]: null });

    UNSAFE_componentWillMount() {
        this.handleComponentWillMount();
    }

    handleComponentWillMount = async () => {
        try {
            await this.initDataSetList();
            await this.initState();
            await this.createRows();
        } catch (e) {

        }
    }

    UNSAFE_componentWillReceiveProps() {
        this.handleComponentWillRecieveProps();
    }

    handleComponentWillRecieveProps = async () => {
        await this.initDataSetList();
        await this.initState();
        await setTimeout(() => this.createRowsFromStore(), 1000);
    }

    enterFunction = (e) => {
        try {
            var code = e.keyCode || e.which;
            if (code === 13) {
                e.preventDefault();
                return true;
            }
        } catch (e) {

        }
    }

    componentDidMount() {
        this.handleComponentDidMount();
    }

    handleComponentDidMount = async () => {
        try {
            document.addEventListener("keypress", this.enterFunction, false);
        } catch (e) {
            Logger.debug(e);
        }
    }

    initDataSetList = async () => {
        let { allDataset, booleanDataset } = this.props.gStore;
        await this.setState({ booleanDataset: booleanDataset, allDataset: allDataset });
    }

    initState = async () => {
        let { booleanDataset, allDataset } = this.state;
        const DataListTypeEditor = await <DropDownEditor  options={ allDataset } />;
        const ConditionListTypeEditor = await <DropDownEditor options={ booleanDataset } />;

        let defaultColumnProperties = { resizable: true, filterable: true };

        let columns = [
            { key: 'action', name: 'Action', width: 60, editable: true, editor: TableActionListTypeEditor },
            { key: 'data', name: 'Data', width: 110, editable: true, editor: DataListTypeEditor },
            { key: 'field', name: 'Name', width: 115, editable: true },
            { key: 'type', name: 'Locator Type', width: 80, editable: true, editor: TableLocatorListTypeEditor },
            { key: 'locator', name: 'Locator', width: 280, editable: true },
            { key: 'locatorData', name: 'Loc Data', width: 55, editable: true, editor: DataListTypeEditor },
            { key: 'condition', name: 'Condition', width: 60, editable: true, editor: ConditionListTypeEditor },
            { key: 'delete', name: 'Action', width: 80 }]
            .map(c => ({ ...c, ...defaultColumnProperties }));

        let nonEditableColumn = [
            { key: 'action', name: 'Action', width: 70 },
            { key: 'data', name: 'Data', width: 120 },
            { key: 'field', name: 'Name', width: 120 },
            { key: 'type', name: 'Locator Type', width: 80 },
            { key: 'locator', name: 'Locator', width: 395, },
            { key: 'locatorData', name: 'Loc Data', width: 55 },
            { key: 'condition', name: 'Condition', width: 60 }]
            .map(c => ({ ...c, ...defaultColumnProperties }));


        await this.setState({ columns, nonEditableColumn });
    }

    getCellActions = (column, row) => {
        try {
            const cellActions = {
                delete: [{
                    icon: <IconButton edge="start" id="createconditionaldataset" style={{ marginLeft: 15, marginRight: 10, color: '#201dce' }} color="inherit" aria-label="menu">
                        <Send fontSize="small" />
                    </IconButton>,
                    callback: () => this.props.handleCustomDataset(row)
                }, {
                    icon: <IconButton edge="start" id="deletestep" color="inherit" aria-label="menu" style={{ color: '#348216' }}>
                        <Delete fontSize="small" />
                    </IconButton>,
                    callback: () => this.handleDelete(row)
                }
                ]
            };
            return cellActions[column.key];
        } catch (e) {
            console.log(e)
        }
    }

    handleFilterChange = (filter) => {
        try {
            let { filters } = this.state;
            const newFilters = { ...filters };
            if (filter.filterTerm) {
                newFilters[filter.column.key] = filter;
            } else {
                delete newFilters[filter.column.key];
            }
            return newFilters;
        } catch (e) {
            Logger.debug(e);
        }
    };


    getRows = (rows, filters) => Selectors.getRows({ rows, filters });

    rowMaker = async () => {
        let { _id, project, step } = this.props.gStore.testcase;
        return await step.map((item, index) => {
            let { action, data, field, condition, seq, locator } = item;
            return {
                id: item.seq, action, data, field, type: locator[0].type, locator: locator[0].id,
                locatorData: locator[0].data, condition, seq, testcase: _id, project
            };
        });
    }

    createRowsFromStore = async () => {
        try {
            let rows = await this.rowMaker();
            await this.setState({ rows });
        } catch (e) {
            Logger.debug(e);
        }
    }

    createRows = async () => {
        try {
            let rows = await this.rowMaker();
            await this.setState({ rows });
        } catch (e) {
            Logger.debug(e);
        }
    }

    onDrag = async (row) => {
        try {
            let { stepTable } = this.props;
            let rows = await row.map((data, index) => {
                let i = 1 + index;
                let locator = [];
                locator.push({ id: data.locator, type: data.type });
                return { ...data, locator, seq: i, id: i };
            });
            let _model = { rows };
            await this.props.sequencePatch(stepTable._id, _model);
        } catch (e) {
            Logger.debug(e);
        }
    };

    rowGetter = i => this.state.rows[i];

    isDraggedRowSelected = (selectedRows, rowDragSource) => {
        if (selectedRows && selectedRows.length > 0) {
            let key = this.props.rowKey;
            return (
                selectedRows.filter(r => r[key] === rowDragSource.data[key]).length > 0
            );
        }
        return false;
    };

    reorderRows = e => {
        let selectedRows = Selectors.getSelectedRowsByKey({
            rowKey: this.props.rowKey,
            selectedKeys: this.state.selectedIds,
            rows: this.state.rows
        });
        let draggedRows = this.isDraggedRowSelected(selectedRows, e.rowSource)
            ? selectedRows
            : [e.rowSource.data];

        let undraggedRows = this.state.rows.filter(function (r) {
            return draggedRows.indexOf(r) === -1;
        });
        let args = [e.rowTarget.idx, 0].concat(draggedRows);
        Array.prototype.splice.apply(undraggedRows, args);
        this.setState({ rows: undraggedRows });
        this.onDrag(undraggedRows);
    };

    onRowsSelected = rows => this.setState({ selectedIds: this.state.selectedIds.concat(rows.map(r => r.row[this.props.rowKey])) });

    onRowsDeselected = rows => {
        let rowIds = rows.map(r => r.row[this.props.rowKey]);
        this.setState({
            selectedIds: this.state.selectedIds.filter(i => rowIds.indexOf(i) === -1)
        });
    };

    onGridRowsUpdated = async ({ fromRow, toRow, updated }) => {
        try {
            let { userId } = this.props.aStore;
            const rows = this.state.rows.slice();
            rows[fromRow] = { ...rows[toRow], ...updated, updatedBy: userId };
            await this.props.handleStepEdit(rows[fromRow]);
            this.setState({ rows: rows });
        } catch (e) {
            Logger.debug(e);
        }
    };


    handleDelete = (row) => {
        let { testcase, project, seq } = row;
        let model = { testcase: testcase, project: project, seq: seq };
        this.setState({ deleteObject: model });
        this.refreshComponent('gKeyDelete');
    }

    handleDeleteCancel = async () => this.resetComponent("gKeyDelete");

    handleDeleteOkay = async () => {
        try {
            let { deleteObject } = this.state;
            await this.props.handleStepDelete(deleteObject);
            this.handleDeleteCancel();
        }
        catch (e) {
            Logger.debug(e);
        }
    }

    renderDeleteModal() {
        let { gKeyDelete } = this.state;
        if (gKeyDelete) {
            return (
                <DeleteModal
                    key={gKeyDelete}
                    handleCancel={this.handleDeleteCancel}
                    handleOkay={this.handleDeleteOkay}
                />
            )
        }
    }

    renderStepTitle() {
        try {
            let { testcase, selectedTestcase } = this.props.gStore;

            let desc, stepCount, dataSetCount = null;

            if (testcase) {
                desc = (testcase.desc) ? testcase.desc : "";
                stepCount = (testcase.step && testcase.step.length > 0) ? testcase.step.length : "0";
                dataSetCount = (testcase.dataSet && testcase.dataSet.length > 0) ? testcase.dataSet.length : "0";
            }
            return (
                <div style={{ display: "flex" }}>
                    <p style={{
                        textAlign: 'left', fontSize: 'small', marginBottom: 0,
                        color: '#2f4f4f', marginLeft: 5, fontFamily: 'tahoma', fontWeight: 600
                    }}>{desc}</p>

                    <p style={{
                        fontSize: 'small', marginBottom: 0, color: '#2f4f4f', marginLeft: 15, fontFamily: 'tahoma'
                    }}>{"Steps : " + stepCount + ", " + "Datasets : " + dataSetCount}</p>

                    <p style={{
                        textAlign: 'right', fontSize: 'small', marginBottom: 0, color: '#2f4f4f',
                        marginLeft: '20%', fontFamily: 'tahoma',fontWeight: 600
                    }}>{"Selected testcase : " + selectedTestcase.desc}</p>
                </div>
            );
        } catch (e) {

        }
    }

    renderStep() {
        try {
            let { rows, filters, columns, nonEditableColumn } = this.state;
            const filteredRows = this.getRows(rows, filters);
            let { mode } = this.props;
            if (mode === "Write") {
                return (
                    <DraggableContainer>
                        <ReactDataGrid
                            style={{ width: "737" }}
                            enableCellSelect={true}
                            onGridRowsUpdated={this.onGridRowsUpdated}
                            rowActionsCell={RowActionsCell}
                            columns={columns}
                            rowGetter={i => filteredRows[i]}
                            rowsCount={filteredRows.length}
                            minHeight={539}
                            rowHeight={20}
                            headerFiltersHeight={30}
                            rowRenderer={<RowRenderer onRowDrop={this.reorderRows} />}
                            toolbar={this.renderStepTitle()}
                            getCellActions={this.getCellActions}
                            onAddFilter={filter => this.setState({ filters: this.handleFilterChange(filter) })}
                            onClearFilters={() => this.setState({ filters: {} })
                            }
                        />
                    </DraggableContainer >
                );
            } else if (mode === "Read") {
                return (
                    <ReactDataGrid
                        style={{ width: "737" }}
                        columns={nonEditableColumn}
                        rowGetter={i => filteredRows[i]}
                        rowsCount={filteredRows.length}
                        minHeight={545}
                        rowHeight={20}
                        headerFiltersHeight={30}
                        toolbar={this.renderStepTitle()}
                        onAddFilter={filter => this.setState({ filters: this.handleFilterChange(filter) })}
                        onClearFilters={() => this.setState({ filters: {} })}
                    />
                );
            }
        } catch (e) {
            console.log(e)
        }
    }

    render() {
        let time = getTime();
        Logger.debug("StepGrid>>>>>>", time);
        return (
            <div>
                {this.renderStep()}
                {this.renderDeleteModal()}
            </div>
        );
    }
}

const mapStateToProps = ({ SignInReducer, ScriptingReducer }) => {
    const aStore = SignInReducer;
    const gStore = ScriptingReducer;
    return { aStore, gStore };
}

export default connect(mapStateToProps, {})(StepReactGrid);


