# ga-bcard

[![Code Climate](https://codeclimate.com/github/phardyn/ga-bcard/badges/gpa.svg)](https://codeclimate.com/github/phardyn/ga-bcard)
[![Issue Count](https://codeclimate.com/github/phardyn/ga-bcard/badges/issue_count.svg)](https://codeclimate.com/github/phardyn/ga-bcard)

Genetic algorithm powered birthday card, created for my friend.
It uses 41 characters long string as a representation of the individual's chromosome. Population counts twenty individuals. In every tenth of a millisecond two children are born from mate of the two strongest individuals and the two weakest die. Individuals are also randomly mutated with 50% chance of mutation of one gen. New generations are created, until one of the individual's chromosome will be equal to "Wszystkiego najlepszego dla Wikipedii! :)", then stats are displayed on the card.


![ga-bcard](ga-bcard.gif)
