import requests
import urllib2
import unicodecsv as csv
import mechanize
from bs4 import BeautifulSoup

outfile = open('senateresults.csv', 'w')
writer = csv.writer(outfile)

br = mechanize.Browser()
url = 'http://enrarchives.sos.mo.gov/enrnet/PickaRace.aspx'
br.open('http://enrarchives.sos.mo.gov/enrnet/PickaRace.aspx')

#Fill out the top form -- item you have to fill out on a website
#Select_form for mechanize takes an argument, select form you want and set it to value of election you want
br.select_form(nr=0)
br.form['ctl00$MainContent$cboElectionNames'] = ['750003566']
br.submit('ctl00$MainContent$btnElectionType')
#Then you have to fill out second form and populate w necessary info
br.select_form(nr=0)
br.form['ctl00$MainContent$cboRaces'] = ['750003269']
br.submit('ctl00$MainContent$btnCountyChange')

#Get HTML
html = br.response().read()
#html = urllib2.urlopen(url).read()

soup = BeautifulSoup(html, "html.parser")
#need to find defining factor for whole table html tag

table = soup.find('table', {'id': "MainContent_dgrdCountyRaceResults"})

outfile = open('senateresults.csv', 'w')
writer = csv.writer(outfile)

#need to define 
list_of_rows = []
for row in table.find_all('tr'):
    list_of_cells = []
    for cell in row.find_all('th'):
        text = cell.text
        list_of_cells.append(text)
        if cell.text == " ":
            break
    for cell in row.find_all('td'):
        text = cell.text
        list_of_cells.append(text)
    list_of_rows.append(list_of_cells)


for to_write_row in list_of_rows:
    writer.writerow(to_write_row)


