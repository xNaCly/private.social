package config

import (
	"bufio"
	"log"
	"os"
	"strings"
)

var CONFIG_KEYS = []string{"MONGO_URL"}

// config dynamically loaded from env variables
var Config map[string]string = make(map[string]string)

// loads the .env file and sets the environment variables defined in it
func LoadDotEnv() {
	file, err := os.Open(".env")
	defer file.Close()

	if err != nil {
		return
	}

	scanner := bufio.NewScanner(file)

	for scanner.Scan() {
		l := scanner.Text()

		if len(l) == 0 || l[0] == '#' {
			continue
		}

		nl := strings.Split(l, "=")

		if len(nl) == 2 {
			os.Setenv(nl[0], nl[1])
			log.Printf("loaded variable '%s' with value '%s'\n", nl[0], nl[1])
		}
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
}

func LoadConfig() {
	for _, key := range CONFIG_KEYS {
		if val, ok := os.LookupEnv(key); ok {
			Config[key] = val
		}
	}
}
