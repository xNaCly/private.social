package config

import (
	"errors"
	"os"
)

func GetEnv(key string) (string, error) {
	res := os.Getenv(key)

	if res == "" {
		return "", errors.New("env var not found")
	}

	return res, nil
}
