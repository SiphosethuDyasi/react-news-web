import React from 'react';
import {Grid, Card, Paper, TextField, InputAdornment, CardContent, Typography} from '@material-ui/core';
import '../components/StyleSheet.css';
import SearchIcon from '@mui/icons-material/Search';
import DatePicker from 'react-datepicker'
import Pagination from '@mui/material/Pagination';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

class NewsComponent extends React.Component{

    constructor() {
        super();    
        this.state = {
            publishers: [],
            articles: [],
            popularArticle: [],
            articleSource: '',
            searchTerm: '',
            dateFrom: '',
            dateTo: ''
        }


    this.searchTermChange = this.searchTermChange.bind(this);
    this.dateFromChange = this.dateFromChange.bind(this);
    this.dateToChange = this.dateToChange.bind(this);

    this.searchArticles = this.searchArticles.bind(this);
    this.handleChange = this.handleChange.bind(this)
      }

    searchTermChange(event){
        this.setState({
            searchTerm: event.target.value,
        })
    }

    dateFromChange(event){
        this.setState({
            dateFrom: event.target.value,
        })
    }

    dateToChange(event){
        this.setState({
            dateTo: event.target.value,
        })
    }

    apiKey = '79d6cccb83f745048ad39a9ab5add978';

    selectedListitem = (publisherName) => {
        this.getArticles();
        this.setState({
            articles: this.state.articles.filter(article => article.source.name === publisherName)
        })
    }

    handleChange = (value) => {
        
        console.log(value)
    };

    searchArticles(event){
        event.preventDefault();
        console.log(this.state.searchTerm + this.state.dateFrom, this.state.dateTo);

        fetch('https://newsapi.org/v2/everything?q='+this.state.searchTerm+'&from='+this.state.dateFrom+'&to='+this.state.dateTo+'&sortBy=popularity&apiKey='+this.apiKey)
        .then(res => res.json())
        .then((data) => {
            this.setState({ articles: data.articles});
            this.setState({ popularArticle: data.articles[0]});
            this.getPublishers();
        })
        .catch(console.log);

    }

    getPublishers(){
        var array = []
        this.state.articles.map(publisher => {
            if( array.find(f => f.name === publisher.source.name) === undefined){
                array.push(publisher.source);
            }  
        });
        this.setState({ publishers: array});
    }

    getArticles(){
        fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey='+this.apiKey)
        .then(res => res.json())
        .then((data) => {
          this.setState({ articles: data.articles});
          this.setState({ popularArticle: data.articles[0]});
          this.setState({ articleSource: this.state.popularArticle.source.name});
          this.getPublishers();
        })
        .catch(console.log);
    }

    componentDidMount() {
        this.getArticles();
      }

    render(){
        
        return( 
            <Paper elevation={0} className="paper">
                <form>
                    <Grid container spacing={2} >
                        <Grid item xs={4}>
                            <TextField
                                class="border"
                                    value={this.state.searchTerm} 
                                    onChange={this.searchTermChange}
                                    placeholder='search'
                                    margin="normal"
                                    
                                    InputProps={{
                                        disableUnderline: true,
                                        startAdornment: (
                                            <InputAdornment position='start' className="pl-1">
                                                <SearchIcon/>
                                            </InputAdornment>
                                        ),
                                    }} />
                        </Grid>
                        <Grid item xs={2}>
                            <input type="date" class="border-bottom date" placeholder="from" value={this.state.dateFrom} onChange={this.dateFromChange}></input>
                        </Grid>
                        <Grid item xs={2}>
                            <input type="date" class="border-bottom date" placeholder="to" value={this.state.dateTo} onChange={this.dateToChange}></input>
                        </Grid>
                        <Grid item xs={2}>
                            <button class="submit" onClick={this.searchArticles}>Search</button>
                        </Grid>
                    </Grid>
                </form>

                <Grid container style={{marginTop: '5%'}}>
                    <Grid item xs={8}>
                        {
                           <Grid item xs={12}>
                                <Card elevation={0} style={{borderRadius: 0}}>
                                    <img className="image" src={this.state.popularArticle.urlToImage} alt="..." style={{height: '250px' }}/>
                                    <CardContent>
                                        <Grid container>
                                            <Grid item xs={9}>
                                                <p className="p">{this.state.articleSource}</p>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <p className="p">{this.state.popularArticle.publishedAt}</p>
                                            </Grid>
                                        </Grid>
                                        
                                        <h2 className="heading">{this.state.popularArticle.title}</h2>
                                        <p>{this.state.popularArticle.description}</p>
                                        <button class="submit">
                                            Read More
                                        </button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        }
                        <Grid container>
                            <Grid item xs={12}>
                                <Divider style={{marginBottom: 40, marginTop: 15}}/>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            {
                                this.state.articles.map(article => {
                                    
                                    return   <Grid item xs={6}>
                                            <Card className="card" elevation={0} style={{borderRadius: 0}}>
                                                <img className="image" src={article.urlToImage} alt="..." />
                                                <CardContent className="smallDescription">

                                                    <p className="p">{article.source.name}</p>
                                                    <h2 className="heading">{article.title}</h2>
                                                    <p className="p">{article.publishedAt}</p>
                                                    <button class="smallDescriptionButtons">
                                                        Read More
                                                    </button>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                })
                            }
                               <Grid item xs={12}>
                                <Pagination className="pagination" color="secondary" count={this.state.articles.length} hidePrevButton showLastButton onChange={() => this.handleChange('cake')} />
                               </Grid>
                        </Grid>
                       
                    </Grid>
                    <Grid item xs={1} style={{ display: 'flex', justifyContent: 'center'}}>
                        <Divider orientation="vertical"/>
                    </Grid>
                    <Grid item xs={3}>
                    <Divider/>
                        <h2 className="heading" style={{textAlign: 'center', padding: '8%'}}>PUBLISHER</h2>
                        {
                            this.state.publishers.map(publisher => {
                                return <ul key={publisher.name} className="list" onClick={() => this.selectedListitem(publisher.name)}>{publisher.name}</ul>
                            })
                        }
                    </Grid>
                </Grid>
            </Paper>
        )
    }
}

export default NewsComponent;