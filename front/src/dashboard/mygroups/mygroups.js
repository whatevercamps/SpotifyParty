import React from 'react';
import './mygroups.css';
import {Accordion, Card, ToggleButtonGroup, ToggleButton, Form, Button, Collapse} from 'react-bootstrap';

class MyGroups extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            user: null,
            loggedIn: false,
            getgroups: false,
            groups: null,
            newPlaylist: '',
            newPlaylistGroup: '',
            newGroup: '',
            newMember: '',
            newMemberGroup: '',
        }
    }

    componentDidUpdate(){
        if(this.props.user !== this.state.user && this.props.user !== null) // when user changes
        {
            this.setState({user: this.props.user, loggedIn: true, getgroups: true});
            
        }

        if(this.state.groups !== null && this.props.updatedPlaylist !== null)
        {
            var groups = this.state.groups;
            groups.map((element, i) => {
                if(element.playlists.length > 0)
                {
                    var playlists = element.playlists;
                    playlists.map((playlist, index) => {
                        if(playlist.name === this.props.updatedPlaylist.name)
                        {
                            if(playlist.tracklist !== this.props.updatedPlaylist.tracklist)
                            {
                                var newgroups = groups;
                                newgroups[i].playlists[index].tracklist = this.props.updatedPlaylist.tracklist;
                                this.setState({groups: newgroups});
                                
                            }
                        }
                    });
                }
            });
        }    

        if(this.state.loggedIn = true && this.state.getgroups === true)
        {
            this.getAllgroups();
        }
    }

    getAllgroups() {
        fetch("/getallgroups")
        .then(res => res.json()
        .then(res => {
            console.log("Res is: ", res);
            this.setState({groups: res, getgroups: false})
            
        }));
    }

    handleSelectedPlaylist = (val) => {
        this.props.getplaylist(val[0]);
        this.props.getGroup(val[1]);
    }

    handleInputChange = (event) => {
        this.setState({
            [event.target.name]: [event.target.value], 
        })
    }

    handleAddPlaylistSubmit = (event) => {
        event.preventDefault();
        if(event.target.newPlaylist.value !== '')
        {
            fetch('/createplaylist', 
            {
                method: 'POST', 
                body: JSON.stringify({newplaylist: `${this.state.newPlaylist}`, relatedgroup: `${event.target.newPlaylistGroup.value}`}),
                headers: { 'Content-Type': 'application/json' },
            }).then(res => res.json())
            .then(resp => {
                console.log("addplaylist response:", resp);
                if(resp !== null)
                {
                    this.setState({newPlaylist: '', newPlaylistGroup: '', getgroups: true});
                    console.log(this.state.newPlaylist);
                }
            });
        }
    }

    handleAddGroupSubmit = (event) => {
        event.preventDefault();
        if(event.target.newGroup.value !== '')
        {
            fetch('/creategroup', 
            {
                method: 'POST', 
                body: JSON.stringify({newgroup: `${this.state.newGroup}`}),
                headers: { 'Content-Type': 'application/json' },
            }).then(res => res.json())
            .then(resp => {
                if(resp !== null)
                {
                    this.setState({newGroup: '', getgroups: true});
                }
            });
        }
    }

    handleAddMemberSubmit = (event) => {
        event.preventDefault();
        if(event.target.newMember.value !== '')
        {
            fetch('/addmember', 
            {
                method: 'POST', 
                body: JSON.stringify({newMember: `${this.state.newMember}`, relatedgroup: `${event.target.newMemberGroup.value}`}),
                headers: { 'Content-Type': 'application/json' },
            }).then(res => res.json())
            .then(resp => {
                if(resp !== null)
                {
                    this.setState({newMember: '', newMemberGroup: '', getgroups: true});
                    
                }
            });
        }
    }

    render() {

        return (
            <div className="fullsize">
                { this.state.user !== null ?
                    <div className="fullsize">

                        { this.state.groups !== null ?
                            <Accordion defaultActiveKey="0">
                                {   this.state.groups.map((group, index) =>
                                    {
                                        return (
                                        <Card>
                                            <Accordion.Toggle as={Card.Header} eventKey={index}>
                                                {group.groupname}
                                            </Accordion.Toggle>
                                            <Accordion.Collapse eventKey={index}>
                                                <Card.Body>
                                                    <h4>Members</h4>
                                                    <ul>
                                                        {group.members.map((member, i) => {
                                                            return(<h6>{member}</h6>)
                                                            })
                                                        }
                                                    </ul>
                                                    <Accordion>
                                                        <Accordion.Toggle as={Button} eventKey={3}>
                                                            Add Member
                                                        </Accordion.Toggle>
                                                       
                                                        <Accordion.Collapse eventKey={3}>
                                                            <Card.Body>
                                                                <form onSubmit={this.handleAddMemberSubmit}>
                                                                    <Form role="form">
                                                                        <Form.Group>
                                                                            <Form.Control name="newMemberGroup" type="hidden" value={this.state.groups[index].groupname}/>
                                                                            <Form.Control onChange={this.handleInputChange} name="newMember" type="email" placeholder="Enter email" value={this.state.newMember}/>
                                                                            
                                                                            <Button className="btnAddPlaylist" variant="success" type="submit">
                                                                                Add
                                                                            </Button>
                                                                        </Form.Group>
                                                                    </Form>
                                                                </form>
                                                            </Card.Body>
                                                        </Accordion.Collapse>
                                                    </Accordion>
                                                    <h4 className="btnAddPlaylist">Playlists</h4>
                                                    <div id="fixedspacing">
                                                        <p></p>
                                                    </div>
                                                    <ToggleButtonGroup type="radio" name="playlists" vertical onChange={this.handleSelectedPlaylist}>
                                                        {group.playlists.map((playlist, i) => {
                                                            return(
            
                                                                <ToggleButton value={[this.state.groups[index].playlists[i],this.state.groups[index].groupname]} >{playlist.name}</ToggleButton>
                                                                
                                                            )
                                                        })
                                                        }
                                                    </ToggleButtonGroup>
                                                    <div id="fixedspacing">
                                                        <p></p>
                                                    </div>
                                                    <Accordion>
                                                        <Accordion.Toggle as={Button} eventKey={2}>
                                                            Create Playlist
                                                        </Accordion.Toggle>
                                                       
                                                        <Accordion.Collapse eventKey={2}>
                                                            <Card.Body>
                                                                <form onSubmit={this.handleAddPlaylistSubmit}>
                                                                    <Form role="form">
                                                                        <Form.Group>
                                                                            <Form.Control name="newPlaylistGroup" type="hidden" value={this.state.groups[index].groupname}/>
                                                                            <Form.Control onChange={this.handleInputChange} name="newPlaylist" type="text" placeholder="Enter name" value={this.state.newPlaylist}/>
                                                                            
                                                                            <Button className="btnAddPlaylist" variant="success" type="submit">
                                                                                Create
                                                                            </Button>
                                                                        </Form.Group>
                                                                    </Form>
                                                                </form>
                                                            </Card.Body>
                                                        </Accordion.Collapse>
                                                    </Accordion>
                                              </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                        
                                        )
                                    })
                                }
                            </Accordion> 
                        :
                            <div>
                                
                            </div>
                        }

                        <Accordion>
                            <Accordion.Toggle as={Card.Header} eventKey={1}>
                                Create Group
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey={1}>
                                <Card.Body>
                                    <form onSubmit={this.handleAddGroupSubmit}>
                                        <Form>
                                            <Form.Group>
                                            <Form.Control onChange={this.handleInputChange} name="newGroup" type="text" placeholder="Enter name" value={this.state.newGroup}/>
                                            </Form.Group>
                                            <Button variant="success" type="submit">
                                                Create
                                            </Button>
                                        </Form>
                                    </form>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Accordion>
                            
                    </div>
                    :
                    <h4>Not logged in</h4>
                }
                    
                
            </div>
        );
    }
}
export default MyGroups;