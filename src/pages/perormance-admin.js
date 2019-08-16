import React, { Component } from 'react';
import clsx from 'clsx';
import InformationModal from './InformationModal'
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import Select from 'react-select';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';

import { connect } from 'react-redux';

import Layout from '../components/Layout'

import { PgMainActions } from '../actions'
var truncate = require("underscore.string/truncate");

// function createData(url_label, url, key, active) {
//     return { url_label, url, key, active };
// }


class admin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orderBy: 'url',
            order: 'asc',
            selected: [],
            page: 0,
            dense: true,
            rowsPerPage: 10,
            newArray: [],
            maxLength: 100,
            teamNameSearch: '',
            labelSearch: '',
            siteNameSearch: '',
            intTeamNameSearch: '',
            modalVisable: false,
            disabled: true,
            activeItem: {},
            rows: [],
            originalRows: [],
            teamSelected: { value: 0, label: "All" },
            teamNamesList: [
                { value: 0, label: "All" },
                { value: 1, label: "ancestry-us" },
                { value: 2, label: "ancestry-de" },
                { value: 3, label: "ancestry-uk" },
                { value: 6, label: "comp-familysearch" },
                { value: 7, label: "comp-23me" },
                { value: 8, label: "comp-myheritage" },
                { value: 10, label: "ancestry-au" },
                { value: 11, label: "comp-livingdna" },
                { value: 12, label: "comp-findmypast" },
            ],
            deleteModal: false,

        }
        this.handleChangePage = this.handleChangePage.bind(this)

    }

    componentWillReceiveProps(nextProps) {
        if (this.props.entities.length !== nextProps.entities.length) {
            nextProps.entities.forEach(row => {
                if (row.team_id !== 13 && row.team_id !== 14) {
                    this.state.rows.push(row) &&
                        this.state.originalRows.push(row)
                }
            })

        }
    }

    componentDidMount() {
       
        this.props.getTeamData()
        this.props.getTeamName()
        this.props.entities.forEach((row) => {
            if (row.team_id !== 13 && row.team_id !== 14) {
                this.state.rows.push(row) &&
                    this.state.originalRows.push(row)
            }
        })
        // this.setState({ rows: Object.values(entities) })


    }

    handleRequestSort = (event, property) => {
        const isDesc = this.state.orderBy === property && this.state.order === 'desc';
        this.setState({ order: isDesc ? 'asc' : 'desc' })

        this.setState({ orderBy: property });
    }

    handleDelete = () => {
        const { selected } = this.state
        let filtered = this.state.rows.filter(row => selected.indexOf(row.page_id) === -1)
        this.setState({ rows: filtered })
    }

    handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = this.state.rows.map(n => n.page_id);
            this.setState({ selected: newSelecteds });
            return;
        }
        this.setState({ selected: [] });
    }

    handleClick = (event, page_id) => {
        const selectedIndex = this.state.selected.indexOf(page_id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(this.state.selected, page_id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(this.state.selected.slice(1));
        } else if (selectedIndex === this.state.selected.length - 1) {
            newSelected = newSelected.concat(this.state.selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                this.state.selected.slice(0, selectedIndex),
                this.state.selected.slice(selectedIndex + 1),
            );
        }

        this.setState({ selected: newSelected });
    }

    handleChangePage = (event, newPage) => {
        this.setState({ page: newPage });
    }

    handleChangeRowsPerPage = (event) => {
        this.setState({ rowsPerPage: +event.target.value });
        this.setState({ page: 0 });
    }

    handleChangeDense = (event) => {
        this.setState({ dense: !this.state.dense });
    }

    handleKeyCheck = (id) => {

        let { rows } = this.state

        rows = rows.map(obj => {
            if (obj.page_id === id) {
                obj.key_page = (obj.key_page === 1) ? 0 : 1
            }
            return obj
        })
        this.setState({ rows })
    }
    handleReportCheck = () => {
        console.log()
    }

    handleModal = (row) => {
        this.setState({
            modalVisable: !this.state.modalVisable,
            activeItem: row,
            disabled: true,

        })
    }

    //Where the drop down filter for teamname is first handled before dual search

    handleFilter = (teamSelected) => {
        this.setState({ teamSelected }, this.handleDualSearch)
    }

   

    handleDualSearch = () => {
        const { teamNameSearch, labelSearch, originalRows, siteNameSearch, intTeamNameSearch, teamSelected } = this.state
        let currentList = [...originalRows];
        let newList = []
        if (teamNameSearch === '' && labelSearch === '' && siteNameSearch === '' && intTeamNameSearch && teamSelected.value===0) {
            newList = originalRows
        } else {
            newList = currentList.filter(item => {
                if(teamSelected.value === 0){
                    return true
                } else if(teamSelected.value === item.team_id){
                    return true
                } return false
            }).filter(item => {
                const siteName = item.site_name.toLowerCase();
                const label = item.url_label.toLowerCase();
                const teamName = (item.team_name) ? item.team_name.toLowerCase() : 'My team Name';

                const filter = labelSearch.toLowerCase();
                const filter2 = siteNameSearch.toLowerCase();
                const filter3 = teamNameSearch.toLowerCase();
                return label.includes(filter) && siteName.includes(filter2) && teamName.includes(filter3)

            })
        }
        this.setState({ rows: newList })
    }

    //this method is what is envoked when you type into the search boxes and leads to where using multipul
    //is made possible

    handleSearch = (e, type) => {
        if (type === 'label') {
            this.setState({ labelSearch: e.target.value }, () => this.handleDualSearch())
        }
        if (type === 'teamName') {
            this.setState({ teamNameSearch: e.target.value }, () => this.handleDualSearch())
        }
        if (type === 'siteName') {
            this.setState({ siteNameSearch: e.target.value }, () => this.handleDualSearch())
        }
        
    }

    stableSort = (array, cmp) => {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = cmp(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map(el => el[0]);
    }

    handleDeselect = () => {
        let newArr = []
        this.setState({ selected: newArr })
    }

    getSorting = (order, orderBy) => {
        return order === 'desc' ? (a, b) => this.desc(a, b, orderBy) : (a, b) => -this.desc(a, b, orderBy);
    }

    EnhancedTableHead = (props) => {
        const { order, orderBy, onRequestSort } = props;
        const headRows = [

            { id: '', numeric: false, disablePadding: false, label: '' },
            { id: 'label', numeric: false, disablePadding: true, label: 'Label' },
            { id: 'site_name', numeric: false, disablePadding: false, label: 'Site Name' },

            { id: 'key_page', numeric: true, disablePadding: false, label: 'Team Name' },
            { id: 'url', numeric: true, disablePadding: false, label: 'Url' },
            { id: 'key_page', numeric: false, disablePadding: false, label: 'Key page' }


            // { id: 'protein', numeric: true, disablePadding: false, label: 'Protein (g)' },
        ];
        const createSortHandler = property => event => {
            onRequestSort(event, property);
        };



        return (
            <TableHead>
                <TableRow>

                    {headRows.map(row => (
                        <TableCell
                            id='flex2'
                            key={row.page_id}
                            // align={(row[0] ? "left" : "center")}
                            padding={row.disablePadding ? 'none' : 'default'}
                            sortDirection={orderBy === row.page_id ? order : false}
                            display={'flex'}
                            flex-direction={'column'}

                        >

                            <div className='flex'>
                                <TableSortLabel
                                    className='column-title'
                                    active={orderBy === row.id}
                                    direction={order}
                                    onClick={createSortHandler(row.id)}
                                >


                                    {row.label}


                                </TableSortLabel>
                                {/* <input /> */}
                            </div>

                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        );
    }

    EnhancedTableToolbar = props => {
        const useToolbarStyles = makeStyles(theme => ({
            root: {
                paddingLeft: theme.spacing(2),
                paddingRight: theme.spacing(1),
            },
            highlight:
                theme.palette.type === 'light'
                    ? {
                        color: theme.palette.secondary.main,
                        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
                    }
                    : {
                        color: theme.palette.text.primary,
                        backgroundColor: theme.palette.secondary.dark,
                    },
            spacer: {
                flex: '1 1 100%',
            },
            actions: {
                color: theme.palette.text.secondary,
            },
            title: {
                flex: '0 0 auto',
            },
        }));
        const classes = useToolbarStyles();
        const { numSelected } = props;


        return (
            <Toolbar
                className={clsx(classes.root, {
                    [classes.highlight]: numSelected > 0,
                })}
            >
                <div >
                    {numSelected > 0 ? (
                        <Typography color="inherit" variant="subtitle1">
                            {numSelected} selected
              <Button onClick={this.handleDeselect} component="span" className='button'>
                                De-select all
        </Button>
                        </Typography>
                    ) : (
                            <header className="bgColor3 bgDark bgTexture3 pageHeader">
                                <div className="pageActions pageActionsCenter480">
                                    <nav className="pageCrumbs">
                                        <span className="pageCrumb icon iconArrowRight" />
                                        <strong className="pageCrumb">Admin</strong>
                                    </nav>
                                </div>
                            </header>
                        )}
                </div>
                <div className={classes.spacer} />
                <div className={classes.actions}>
                    {numSelected > 0 ? (
                        <div id='icon-container'>
                            <Tooltip title="Deselect">
                                <IconButton aria-label="Deselect" size='small' id='icon-button'>
                                    <p className='icon iconClose'></p>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">

                                <IconButton size='large' aria-label="Delete">
                                    <DeleteIcon onClick={() => { props.handleDelete() }} />
                                </IconButton>

                            </Tooltip>

                        </div>
                    ) : (

                            null
                        )}
                </div>
            </Toolbar>
        );
    };

    desc = (a, b, orderBy) => {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    handleUrlLength(str) {
        truncate("Hello", 20);
    }



    render() {

        const { location} = this.props

        const useStyles = makeStyles(theme => ({
            root: {
                width: '100%',
                marginTop: theme.spacing(3),
            },
            paper: {
                width: '100%',
                marginBottom: theme.spacing(2),
            },
            table: {
                minWidth: 750,
            },
            tableWrapper: {
                overflowX: 'auto',
            },
        }));
        const classes = useStyles;

        const isSelected = page_id => this.state.selected.indexOf(page_id) !== -1;

        const emptyRows = this.state.rowsPerPage - Math.min(this.state.rowsPerPage, this.state.rows.length - this.state.page * this.state.rowsPerPage);

        return (
            <Layout location={location}>
                <div className='new-header'>

                    <header className={this.state.selected.length > 0 ? "bgColor6 bgDark bgTexture3 pageHeader" :
                        "bgColor3 bgDark bgTexture3 pageHeader"}>
                        <div className="pageActions pageActionsCenter480">
                            {this.state.selected.length > 0 ? (
                                <nav className="pageCrumbs">
                                    <span className="pageCrumb icon iconArrowRight" />
                                    <strong className="pageCrumb">Admin</strong>
                                    <div className='selected'>{this.state.selected.length} Selected </div>
                                    <div className='selected-icons'>
                                        <Tooltip className='deselect' title="Deselect">
                                            <IconButton aria-label="Deselect All" size='small' id='icon-button'>
                                                <p className='icon iconClose' onClick={this.handleDeselect}></p>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip className='delete' title="Delete">

                                            <IconButton size='large' aria-label="Delete Selected">
                                                <DeleteIcon />
                                            </IconButton>

                                        </Tooltip>
                                    </div>
                                </nav>
                            )
                                :
                                <nav className="pageCrumbs">
                                    <span className="pageCrumb icon iconArrowRight" />
                                    <strong className="pageCrumb">Admin</strong>
                                </nav>
                            }
                        </div>
                    </header>

                </div>

                <div className={classes.root}>



                    <Modal
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        open={this.state.modalVisable}
                        onClose={this.handleModal}
                    >

                        <div className='modal-info'>
                            <div className='title-container'>
                                <h2 id="modal-title">Test Details</h2>
                                <IconButton aria-label="Deselect All" size='small' id='icon-button'>
                                    <p onClick={() => this.setState({ modalVisable: false })} className='icon iconClose'></p>
                                </IconButton>
                            </div>
                            <section className='team-label'>
                                <h2>Team Name</h2>
                                <input
                                    className="title"
                                    defaultValue={"Comming soon"}

                                    disabled={
                                        !this.state.disabled
                                            ? ""
                                            : "disabled"
                                    }

                                />
                                <h2>Page Label</h2>
                                <input
                                    className="title"
                                    placeholder={`${this.state.activeItem.url_label}`}

                                    disabled={
                                        true
                                    }

                                />
                            </section>
                            <section className='url-section'>
                                <h3>URL</h3>
                                <input
                                    className="url-input"
                                    // placeholder={`${this.state.activeItem.url}`}
                                    defaultValue={this.state.activeItem.url}
                                    disabled={
                                        !this.state.disabled
                                            ? ""
                                            : "disabled"
                                    }

                                />
                            </section>
                            <div className='measure-table'>
                                <section className='section1'>
                                    <div className='table-sec-header'>
                                        <h2>Measure</h2>
                                    </div>

                                </section>
                                <section className='section2'>
                                    <div >
                                        <h2>Value</h2>
                                    </div>
                                </section>
                            </div>
                            <div className={this.state.disabled ? 'disabled-container' : 'button-container'}>
                                {!this.state.disabled ?
                                    <button onClick={() => this.setState({ disabled: !this.state.disabled })}>cancel</button>
                                    :
                                    <button onClick={() => this.setState({ disabled: !this.state.disabled })}>edit</button>
                                }
                                {!this.state.disabled ? <button>submit</button> : null}
                            </div>
                        </div>
                    </Modal>



                    <Paper className={classes.paper}>
                        {/* <this.EnhancedTableToolbar handleDelete={this.handleDelete} numSelected={this.state.selected.length} /> */}
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50, 100]}
                            component="div"
                            count={this.state.rows.length}
                            rowsPerPage={this.state.rowsPerPage}
                            page={this.state.page}
                            backIconButtonProps={{
                                'aria-label': 'Previous Page',
                            }}
                            nextIconButtonProps={{
                                'aria-label': 'Next Page',
                            }}
                            onChangePage={this.handleChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        />
                        <div className='filter-search'>

                            {/* ********* these are the search and filter fields *********8 */}

                            <TextField
                                id="standard-dense"
                                label="Search by Label"
                                className={clsx(classes.textField, classes.dense)}
                                type="email"
                                name="Label Search"
                                margin="dense"

                                onChange={(e) => this.handleSearch(e, 'label')}
                            />
                            <TextField
                                id="standard-dense"
                                label="Search by Site Name"
                                className={classes.textField}
                                type="text"
                                name="text"
                                margin="dense"
                                onChange={(e) => this.handleSearch(e, 'siteName')}
                            />

                            {/* <TextField
                                id="standard-dense"
                                label="Search by Team Name"
                                className={clsx(classes.textField, classes.dense)}
                                // type="text"
                                name="Team Name"
                                margin="dense"

                                onChange={(e) => this.handleSearch(e, 'teamName')}
                            /> */}


                            <Select onChange={this.handleFilter} placeholder='Filter By Team' className='dropdown' value={this.state.teamNamesList.value} options={this.state.teamNamesList} helperText="Select a team name" />
                            {/* <Select placeholder='Filter By Team Comp' className='dropdown' options={'none'} />
              <Select placeholder='Filter By Team Site' className='dropdown' options={'none'} /> */}
                        </div>
                        <div className={classes.tableWrapper}>

                            <Table
                                className={classes.table}
                                aria-labelledby="tableTitle"
                                size={this.state.dense ? 'small' : 'medium'}
                            >

                                <this.EnhancedTableHead
                                    numSelected={this.state.selected.length}
                                    order={this.state.order}
                                    orderBy={this.state.orderBy}
                                    onSelectAllClick={this.handleSelectAllClick}
                                    onRequestSort={this.handleRequestSort}
                                    rowCount={this.state.rows.length}
                                />

                                <TableBody>
                                    {this.stableSort(this.state.rows, this.getSorting(this.state.order, this.state.orderBy))
                                        .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                                        .map((row, index) => {
                                            console.log(row, 'row')
                                            
                                            const isItemSelected = isSelected(row.page_id);
                                            const labelId = `enhanced-table-checkbox-${index}`;
                                            return (

                                                <TableRow
                                                    hover
                                                    //   onClick={event => this.handleClick(event, row.page_id)}
                                                    role="checkbox"
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={row.page_id}
                                                    selected={isItemSelected}

                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={isItemSelected}
                                                            inputProps={{ 'aria-labelledby': labelId }}
                                                            onClick={event => this.handleClick(event, row.page_id)}
                                                        />
                                                    </TableCell>


                                                    <TableCell id="table-row" onClick={event => this.handleClick(event, row.page_id)} align='left' component="th" scope="row" padding-left="1" width={400}>
                                                        {row.url_label}
                                                    </TableCell>
                                                    <TableCell width={200} align="left">
                                                        {row.site_name}
                                                    </TableCell>
                                                    <TableCell width={200} align="left">
                                                        {this.state.teamNamesList.map(team => {
                                                            if (team.value === row.team_id) {
                                                               
                                                                return <h2>{team.label}</h2>
                                                            }
                                                            return null
                                                        })}
                                                    </TableCell>



                                                    <TableCell id="table-row" width={650} align="left">
                                                        {row.url}</TableCell>
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={row.key_page}
                                                            inputProps={{ 'aria-labelledby': labelId }}
                                                            onClick={()=>this.handleKeyCheck(row.page_id)}

                                                        />
                                                    </TableCell>



                                                    {/* <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        /> */}
                                                </TableRow>
                                            );
                                        })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 49 * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50, 100]}
                            component="div"
                            count={this.state.rows.length}
                            rowsPerPage={this.state.rowsPerPage}
                            page={this.state.page}
                            backIconButtonProps={{
                                'aria-label': 'Previous Page',
                            }}
                            nextIconButtonProps={{
                                'aria-label': 'Next Page',
                            }}
                            onChangePage={this.handleChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        />
                    </Paper>
                    <FormControlLabel
                        control={<Switch checked={this.state.dense} onChange={this.handleChangeDense} />}
                        label="Dense padding"
                    />
                </div>
                {this.state.deleteModal ?
                    <InformationModal

                    >
                        <p>Are you sure you want to delete?</p>
                    </InformationModal>
                    : null
                }
            </Layout>
        );
    }
}

admin.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

admin.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

const mapStateToProps = ({
    AuthState: { user },
    PgMain:
    { isFetching,
        entities,
        error,
        ids,
        teamEntities
    }
}) => ({
    user,
    isFetching,
    entities,
    error,
    ids,
    teamEntities
})
const mapDispatchToProps = dispatch => {
    return {
        getTeamData: () => dispatch(PgMainActions.getPerfGateRequest()),
        getTeamName: () => dispatch(PgMainActions.getTeamNameRequest()),
        getUserRole: () => dispatch(PgMainActions.getUserRolesRequest())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(admin)
