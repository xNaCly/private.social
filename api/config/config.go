package config

import (
	"bufio"
	"log"
	"os"
	"strings"
)

// config dynamically loaded from .env file
var Config map[string]string = make(map[string]string)

// loads key value pairs from a .env file into the Config map, .env must be in the same dir as the executable
func LoadDotEnv() {
	file, err := os.Open(".env")
	defer file.Close()

	if err != nil {
		log.Fatal("failed to open .env ", err)
	}

	scanner := bufio.NewScanner(file)

	for scanner.Scan() {
		l := scanner.Text()

		if len(l) == 0 || l[0] == '#' {
			continue
		}

		nl := strings.Split(l, "=")

		if len(nl) == 2 {
			Config[nl[0]] = nl[1]
			log.Printf("loaded variable '%s' with value '%s'\n", nl[0], nl[1])
		}
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
}
