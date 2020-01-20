import React, { Component } from 'react';
import { connect } from 'react-redux';
import Logger from 'js-logger';

import { IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { DeleteModal } from "./index";

import ReactDataGrid from 'react-data-grid';
import "bootstrap/dist/css/bootstrap.css";
import { getTime } from '../../../utils/helper';

const {  Data: { Selectors }, Editors } = require("react-data-grid-addons");

const { DropDownEditor } = Editors;

const BooleanType = <DropDownEditor
    options={[{ key: 1, label: 'true', value: 'true' },
    { key: 2, label: 'false', value: 'false' }]} />;

const DataType = <DropDownEditor
    options={[{ key: 1, label: 'string', value: 'string', },
    { key: 2, label: 'number', value: 'number' },
    { key: 2, label: 'boolean', value: 'boolean' }]} />;

Logger.useDefaults();

class DatasetReactGrid extends Component {
    static defaultProps = { rowKey: "id" };
    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            nonEditableColumn: [],
            rows: [],
            filters: {},

            deleteObject: {},
            gKeyDelete: null,
        };
    }

    refreshComponent = async (key) => this.setState({ [key]: key + Math.random() });
    resetComponent = async (key) => this.setState({ [key]: null });

    UNSAFE_componentWillMount() {
        this.initState();
        this.handleComponentWillMount();
    }

    componentDidMount() {
        this.handleComponentDidMount();
    }

    UNSAFE_componentWillReceiveProps() {
        this.initState();
        setTimeout(() => this.createRowsFromStore(), 500);
    }

    handleComponentDidMount = async () => {
        try {
            document.addEventListener("keypress", this.enterFunction, false);
        } catch (e) {
            Logger.debug(e);
        }
    }

    handleComponentWillMount = async () => {
        await this.createRows()
    }

    enterFunction = (e) => {
        try {
            var code = e.keyCode || e.which;
            if (code === 13) {
                e.preventDefault();
                return true;
            }
        } catch (e) {
            Logger.debug(e);
        }
    }

    initState = async () => {

        try {
            let defaultColumnProperties = { resizable: true, filterable: true };
            let columns = [
                { key: 'data', name: 'Data', width: 182 },
                { key: 'value', name: 'Value', width: 120, editable: true },
                { key: 'auto', name: 'Auto', width: 60, editable: true, editor: BooleanType },
                { key: 'type', name: 'Type', width: 60, editable: true, editor: DataType },
                { key: 'delete', width: 30 }]
                .map(c => ({ ...c, ...defaultColumnProperties }));

            let nonEditableColumn = [
                { key: 'data', name: 'Data', width: 200 },
                { key: 'value', name: 'Value', width: 115, editable: true },
                { key: 'auto', name: 'Auto', width: 70 },
                { key: 'type', name: 'Type', width: 70 }]
                .map(c => ({ ...c, ...defaultColumnProperties }));

            await this.setState({ columns, nonEditableColumn });
        }
        catch (e) {
            console.log(e)
        }
    }

    getCellActions = (column, row) => {
        try {
            const cellActions = {
                delete: [{
                    icon: <IconButton edge="start" id="deletedataset" color="inherit" aria-label="menu" style={{ color: '#348216' }}>
                        <Delete fontSize="small" />
                    </IconButton>,
                    callback: () => this.handleDelete(row)
                }]
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
        let { _id, project, dataSet } = this.props.gStore.testcase;
        return await dataSet.map((item, index) => {
            let { data, value, auto, type, domain, pattern } = item;
            return { id: index, data, value, auto: auto.toString(), type, domain, pattern, testcase: _id, project };
        });
    }

    createRowsFromStore = async () => {
        try {
            let rows = await this.rowMaker();
            this.setState({ rows });
        } catch (e) {
            Logger.debug(e);
        }
    }

    createRows = async () => {
        try {
            let rows = await this.rowMaker();
            this.setState({ rows });
        } catch (e) {
            Logger.debug(e);
        }
    }

    rowGetter = i => this.state.rows[i];

    onGridRowsUpdated = async ({ fromRow, toRow, updated }) => {
        try {
            let { userId } = this.props.aStore;
            const rows = this.state.rows.slice();
            rows[fromRow] = { ...rows[toRow], ...updated, updatedBy: userId };
            await this.props.handleDatasetEdit(rows[fromRow]);
            this.setState({ rows: rows });
        } catch (e) {
            Logger.debug(e);
        }
    };

    handleDelete = (row) => {
        let { testcase, project, data } = row;
        let model = { testcase: testcase, project: project, data: data };
        this.setState({ deleteObject: model });
        this.refreshComponent('gKeyDelete');
    }

    handleDeleteCancel = async () => this.resetComponent("gKeyDelete");


    handleDeleteOkay = async () => {
        try {
            let { deleteObject } = this.state;
            await this.props.handleDatasetDelete(deleteObject);
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

    renderDatasetTitle() {
        return (
            <p style={{
                textAlign: 'left', fontSize: 'small', marginBottom: 0,
                color: '#2f4f4f', marginLeft: 5, fontFamily: 'tahoma', fontWeight: 600
            }}>Testcase Dataset</p>
        );
    }

    renderDataset() {
        let { rows, filters, columns, nonEditableColumn } = this.state;
        const filteredRows = this.getRows(rows, filters);
        let { mode } = this.props;
        if (mode === "Write") {
            return (
                <ReactDataGrid
                    style={{ width: "325" }}
                    enableCellSelect={true}
                    onGridRowsUpdated={this.onGridRowsUpdated}
                    columns={columns}
                    rowGetter={i => filteredRows[i]}
                    rowsCount={filteredRows.length}
                    minHeight={260}
                    rowHeight={20}
                    headerFiltersHeight={30}
                    toolbar={this.renderDatasetTitle()}
                    getCellActions={this.getCellActions}
                    onAddFilter={filter => this.setState({ filters: this.handleFilterChange(filter) })}
                    onClearFilters={() => this.setState({ filters: {} })}
                />
            );
        } else if (mode === "Read") {
            return (
                <ReactDataGrid
                    style={{ width: "325" }}
                    enableCellSelect={true}
                    onGridRowsUpdated={this.onGridRowsUpdated}
                    columns={nonEditableColumn}
                    rowGetter={i => filteredRows[i]}
                    rowsCount={filteredRows.length}
                    minHeight={545}
                    rowHeight={20}
                    headerFiltersHeight={30}
                    toolbar={this.renderDatasetTitle()}
                    onAddFilter={filter => this.setState({ filters: this.handleFilterChange(filter) })}
                    onClearFilters={() => this.setState({ filters: {} })}
                />
            );
        }
    }

    render() {
        let time = getTime();
        Logger.debug("DatasetGrid>>>>>>", time);
        return (
            <div>
                {this.renderDataset()}
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

export default connect(mapStateToProps, {})(DatasetReactGrid);



