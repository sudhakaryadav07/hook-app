import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid';
import "bootstrap/dist/css/bootstrap.css";
import Logger from 'js-logger';

import { IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';

const {
    Draggable: {
        Container: DraggableContainer,
        RowActionsCell,
        DropTargetRowContainer
    },
    Toolbar,
    Data: { Selectors }
} = require("react-data-grid-addons");
const RowRenderer = DropTargetRowContainer(ReactDataGrid.Row);

Logger.useDefaults();

class StepReactGrid extends Component {
    static defaultProps = { rowKey: "id" };
    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            rows: [],
            selectedIds: [],
            filters: {},
            delId: null
        };
    }

    componentDidMount() {
        this.handleComponentDidMount();
    }

    componentWillReceiveProps() {
        setTimeout(() => this.createRows(), 500);
    }

    handleComponentDidMount = async () => {
        try {
            await this.initState();
            await this.createRows();
        } catch (e) {
            Logger.debug(e);
        }
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
                { key: 'testcaseName', name: 'Name', width: 315 },
                { key: 'skip', name: 'Skip', width: 50 },
                { key: 'delete', width: 30 }]
                .map(c => ({ ...c, ...defaultColumnProperties }));
            await this.setState({ columns });
        } catch (e) {
            Logger.debug(e);
        }
    }

    getCellActions = (column, row) => {
        try {
            const cellActions = {
                delete: [{
                    icon: <IconButton edge="start" color="inherit" aria-label="menu">
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

    handleDelete = async (row) => {
        let { rows } = this.state;
        rows = rows.filter(item => item.seq !== row.seq);
        this.setState({ rows });
        this.props.handleDelete(row);
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


    handleStepEdit = (data) => this.props.handleStepEdit(data);

    createRows = async () => {
        try {
            let rows = await this.props.testcase.map((item, index) => {
                let { testcaseId, testcaseName, skip, seq } = item;
                return { id: seq, testcaseId, testcaseName, skip: skip.toString(), seq };
            });
            this.setState({ rows });
        } catch (e) {
            Logger.debug(e);
        }
    }

    onDrag = async (row) => {
        try {
            let rows = await row.map((data, index) => {
                let i = 1 + index;
                return { ...data, id: i, seq: i };
            });
            this.setState({ rows });
            this.props.testsuitSeq(rows);
        } catch (e) {
            Logger.debug(e);
        }
    };

    rowGetter = i => { return this.state.rows[i]; };

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

    onRowsSelected = rows => {
        this.setState({ selectedIds: this.state.selectedIds.concat(rows.map(r => r.row[this.props.rowKey])) });
    };

    onRowsDeselected = rows => {
        let rowIds = rows.map(r => r.row[this.props.rowKey]);
        this.setState({
            selectedIds: this.state.selectedIds.filter(i => rowIds.indexOf(i) === -1)
        });
    };

    onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        let { testsuit } = this.props;
        try {
            this.setState(state => {
                const rows = state.rows.slice();
                for (let i = fromRow; i <= toRow; i++) {
                    rows[i] = { ...rows[i], ...updated };
                    this.props.handleStepEdit(testsuit._id, rows[i])
                }
                return { rows };
            });
        } catch (e) {
            Logger.debug(e);
        }
    };

    renderTable() {
        let { rows, filters } = this.state;
        const filteredRows = this.getRows(rows, filters);
        return (
            <DraggableContainer>
                <ReactDataGrid
                    style={{ width: "200" }}
                    enableCellSelect={true}
                    onGridRowsUpdated={this.onGridRowsUpdated}
                    rowActionsCell={RowActionsCell}
                    columns={this.state.columns}
                    rowGetter={i => filteredRows[i]}
                    rowsCount={filteredRows.length}
                    minHeight={310}
                    rowHeight={20}
                    headerFiltersHeight={30}
                    rowRenderer={<RowRenderer onRowDrop={this.reorderRows} />}
                    toolbar={<Toolbar enableFilter={true} />}
                    getCellActions={this.getCellActions}
                    onAddFilter={filter => this.setState({ filters: this.handleFilterChange(filter) })}
                    onClearFilters={() => this.setState({ filters: {} })}
                />
            </DraggableContainer>
        );
    }


    render() {
        return (
            <div>
                {this.renderTable()}
            </div>

        );
    }
}


export default StepReactGrid;


